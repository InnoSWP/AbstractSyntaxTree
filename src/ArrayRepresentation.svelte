<script lang="ts">
    import type {Program} from 'esprima';
    import type {Node} from './Estree/estreeExtension'
    import { extractChildren } from './Estree/estreeUtils';

    import { afterUpdate, beforeUpdate } from "svelte";
    import { get } from "svelte/store";
    import type {Pattern} from 'estree'
    import { arrayHighlight, nodeIndex, highlightStates } from "./Stores.svelte";

    let hfrom: number, hto: number
    let src: string
    $: [[hfrom, hto], src] = $arrayHighlight

    export let tree: Program = null
    $: PDR = generatePDR(tree)

    function inOrderTraversal(tree: Program): [number, string, string, [number, number]][] {
        type entry = [number, string, string, [number, number]]
        let index: number = 0
        $nodeIndex.clear()
        $highlightStates.length = 0

        function aux(n: Node, depth: number, current: entry[]): entry[] {
            if(n == null) {
                return;
            }
            $nodeIndex.set(n, index)
            $highlightStates[index] = ""
            index++

            let value = "";
            if (n.type != "CallExpression" && n.type != "MemberExpression") {
                value = extractValue(n);
            }
            current.push([depth, n.type, value, n.range]);
            for(let child of extractChildren(n)) {
                current.concat(aux(child, depth+1, current));
            }
            return current;
        }

        return aux(tree, 0, []);
    }

    function generateCoordinates(depths: number[]): number[][] {
        let result: number[][] = []
        let maxDepth = Math.max(...depths)
        for(let d of depths) {
            let newArr = Array(maxDepth + 1).fill(0)
            newArr[d] = 1
            result.push(newArr)
        }
        for(let i = 1; i < depths.length; i++) {
            for(let j = 0; j < maxDepth+1; j++) {
                result[i][j] += result[i - 1][j]
            }
        }

        return result.map((e, i) => e.fill(0, depths[i]+1))
    }

    function generatePDR(tree: Program): [number, string, string, [number, number], ...number[]][] {
        if(tree == null) {
            return []
        }
        let initialArray: [number, string, string, [number, number]][] = inOrderTraversal(tree)
        let depths = initialArray.map((v) => v[0])
        let coords = generateCoordinates(depths)
        
        type entry = [number, string, string, [number, number], ...number[]]
        let result = initialArray.map((e, i): entry => [i, e[1], e[2], e[3], ...coords[i]])
        return result
    }

    function handleMouseEnter(index: number, [from, to]: [number, number]) {
        arrayHighlight.set([[from, to], "arr"])
        highlightFromRoot(index)
    }

    function handleMouseLeave() {
        arrayHighlight.set([[0, 0], "arr"])
        clearHighlight()
    }

    function isChild(ind1: number, ind2: number): boolean {
        if (ind1 == ind2)
            return false
        for (let i = 4; i < PDR[ind1].length && PDR[ind1][i] > 0; i++) {
            if (PDR[ind1][i] != PDR[ind2][i])
                return false
        }
        return true
    }

    function highlightFromRoot(index: number) {
        $highlightStates[index] = "highlightedRoot"
        for (let i = 0; i < $highlightStates.length; i++) {
            if (isChild(index, i)){
                $highlightStates[i] = "highlighted"
            }
        }
    }

    function clearHighlight() {
        for (let i = 0; i < get(highlightStates).length; i++){
            $highlightStates[i] = ""
        }
    }

    beforeUpdate(()=>{
        let index = $highlightStates.findIndex(e => e == "highlightedRoot")
        if (index > -1) {
            highlightFromRoot(index)
        }
    })
</script>

<div class="h-full overflow-scroll">
    <table class="min-w-full border text-center font-mono text-s">
        <thead class="border-b">
            <tr>
                <th scope="col" class="text-gray-900 px-1 py-1 border-r w-0">
                    Type
                </th>
                <th scope="col" class="text-gray-900 px-1 py-1 border-r w-0">
                    Info
                </th>
                <th scope="colgroup" colspan={PDR.length - 2} class="text-sm text-gray-900 px-6 py-4 border-r">
                    Coordinates
                </th>
            </tr>
        </thead>
        <tbody>
            {#each PDR as [index, type, info, [from, to], ...coords]}
            <tr class={$highlightStates[index]}>
                <td class="text-keyword font-light px-0 py-1 border-r border-b w-0 hover:underline cursor-pointer" on:mouseenter={() => handleMouseEnter(index, [from, to])} on:mouseleave={() => handleMouseLeave()}>
                    {type}
                </td>
                <td class="text-literal text-xs font-light px-0 py-1 border-r border-b w-0">
                    {info}
                </td>
                {#each coords as c} 
                <td class="text-gray-900 px-0 py-1 border-r border-b w-0">
                    {c}
                </td>
                {/each}
            </tr>
            {/each}
        </tbody>
    </table>
</div>


<style lang="postcss">
    .highlighted {
        @apply bg-amber-200;
    }

    .highlightedRoot {
        @apply bg-amber-300;
    }
</style>

<script lang="ts" context="module">
    function extractValue(n: Node): string {
        if(n == null) {
            return "";
        }
        switch(n.type) {
            case 'Identifier':
                return n.name; // identifier's name
            case 'Literal':
                return n.value != null ? n.value.toString() : "null"; // literal's value
            case 'ExpressionStatement':
                return extractValue(n.expression);
            case 'BlockStatement':
                return '';
            case 'EmptyStatement':
                return ';';
            case 'DebuggerStatement':
                return 'debugger';
            case 'WithStatement':
                return extractValue(n.object);
            case 'LabeledStatement':
            case 'BreakStatement':
            case 'ContinueStatement':
                return extractValue(n.label);
            case 'SwitchStatement':
                return extractValue(n.discriminant);
            case 'CatchClause':
                return extractValue(n.param);
            case 'SwitchCase':
            case  'IfStatement':
            case 'WhileStatement':
            case 'DoWhileStatement':
                return extractValue(n.test);
            case 'ForInStatement':
                return extractValue(n.right);
            case 'FunctionDeclaration':
                let result = [];
                n.params.forEach((par) => {
                    result.push(extractValuesFromPattern(par));
                });
                let ans = "";
                result.forEach((e) => {
                    ans += e + ", ";
                });
                return `${extractValue(n.id)}(${ans.substring(0, ans.length - 2)})`;
            case 'VariableDeclarator':
                return extractValue(n.id);
            case 'Property':
                return extractValue(n.key);
            case 'UnaryExpression':
            case 'UpdateExpression':
            case 'BinaryExpression':
            case 'AssignmentExpression':
            case 'CompressedBinaryExpression':
            case 'CompressedLogicalExpression':
            case 'LogicalExpression':
                return n.operator;
            case 'CallExpression':
            case 'NewExpression':
                return extractValue(n.callee);
            case 'ArrayExpression':
                return `[${extractValue(n.elements[0])}...]`
            case 'MemberExpression':
                return `${extractValue(n.object)}.${extractValue(n.property)}`
            case 'ThrowStatement':
            case 'ReturnStatement':
            case 'Program':
            case 'TryStatement':
            case 'ForStatement':
            case 'VariableDeclaration':
            case 'ThisExpression':
            case 'ObjectExpression':
            case 'FunctionExpression':
            case 'ConditionalExpression':
            case 'SequenceExpression':
            default:
                return "";
        }
    }


    function extractValuesFromPattern(pattern: Pattern) {
        switch (pattern.type) {
            case "Identifier":
                return [pattern.name];
            case "ObjectPattern":
                let answer = [];
                for (let i = 0; i < pattern.properties.length; i++) {
                    answer.push(extractValuesFromPattern(pattern.properties[i].value));
                }
                return answer;
            case "ArrayPattern":
                let ans = [];
                for (let i = 0; i < pattern.elements.length; i++) {
                    ans.push(extractValuesFromPattern(pattern.elements[i]));
                }
                return ans;
            case "AssignmentPattern":
                return extractValuesFromPattern(pattern.left);
            case "RestElement":
                return extractValuesFromPattern(pattern.argument);
            case "MemberExpression":
                return [extractValue(pattern.property)];
        }
    }

</script>