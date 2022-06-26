import { compressBinaryExpressionsInTree } from '../src/Estree/binaryExpressionCompressor'
import assert from "assert";

import { extractChildren } from '../src/Estree/estreeUtils.js'
import { parseModule } from "esprima";
import type { CompressedBinaryExpression, CompressedLogicalExpression, Node } from '../src/Estree/estreeExtension';


function collectAllCompressedExpressions(node: Node): (CompressedBinaryExpression | CompressedLogicalExpression)[] {
    let children: Node[] = extractChildren(node)
    let collectedCompressedExpressions = [].concat(...children.map(child => collectAllCompressedExpressions(child)))
    if (node.type == "CompressedBinaryExpression" || node.type == "CompressedLogicalExpression") {
        collectedCompressedExpressions = collectedCompressedExpressions.concat(node)
    }
    return collectedCompressedExpressions
}

describe("Expression compressor", () => {

    it("compresses binary expressions", async function () {

        let initialTree = parseModule("console.log(3+3+3)", { range: true })
        let compressedExpressions = collectAllCompressedExpressions(compressBinaryExpressionsInTree(initialTree))

        let hasOnlyOneCompressedExpression = compressedExpressions.length == 1;
        assert(hasOnlyOneCompressedExpression)

        let onlyExpression = compressedExpressions[0]

        let expressionConsistsOfThreeLiterals = onlyExpression.operands.length == 3;
        let isAddition = onlyExpression.operator == '+';
        let isBinaryExpression = onlyExpression.type == "CompressedBinaryExpression";
        assert(expressionConsistsOfThreeLiterals && isAddition && isBinaryExpression)
    });

    it("compresses logical expressions", async function () {

        let initialTree = parseModule("console.log(true && true && false)", { range: true })
        let compressedExpressions = collectAllCompressedExpressions(compressBinaryExpressionsInTree(initialTree))

        let hasOnlyOneCompressedExpression = compressedExpressions.length == 1;
        assert(hasOnlyOneCompressedExpression)

        let onlyExpression = compressedExpressions[0]

        let expressionConsistsOfThreeLiterals = onlyExpression.operands.length == 3;
        let isAnd = onlyExpression.operator == '&&';
        let isLogicalExpression = onlyExpression.type == "CompressedLogicalExpression";
        assert(expressionConsistsOfThreeLiterals && isAnd && isLogicalExpression)
    });

    it("compresses all associative operations", async function () {

        for (let operator of ['+', '&', '&&', '|', '||', '^', '*']) {
            let initialTree = parseModule(`console.log(a ${operator} b ${operator} c)`, { range: true })
            let compressedExpressions = collectAllCompressedExpressions(compressBinaryExpressionsInTree(initialTree))

            let hasOnlyOneCompressedExpression = compressedExpressions.length == 1;
            assert(hasOnlyOneCompressedExpression)

            let onlyExpression = compressedExpressions[0]

            let expressionConsistsOfThreeLiterals = onlyExpression.operands.length == 3;
            let isCorrectOperator = onlyExpression.operator == operator;
            assert(expressionConsistsOfThreeLiterals && isCorrectOperator)
        }
    });

    it("does not compress non-associative operations", async function () {

        for (let operator of ['-', '==', '!=', '/', '%']) {
            let initialTree = parseModule(`console.log(a ${operator} b ${operator} c)`, { range: true })
            let compressedExpressions = collectAllCompressedExpressions(compressBinaryExpressionsInTree(initialTree))

            let doesNotHaveCompressedExpressions = compressedExpressions.length == 0;
            assert(doesNotHaveCompressedExpressions)
        }
    });

    it("does not compress incompressable expressions", async function () {
        let initialTree = parseModule(`console.log(arr[index]).func()`, { range: true })
        let compressedExpressions = collectAllCompressedExpressions(compressBinaryExpressionsInTree(initialTree))

        let doesNotHaveCompressedExpressions = compressedExpressions.length == 0;
        assert(doesNotHaveCompressedExpressions)
    })

    it("compresses nested expressions", async function () {

        let initialTree = parseModule("console.log(3+3+3+(3-3-3*2*3*4))", { range: true })
        let compressedExpressions = collectAllCompressedExpressions(compressBinaryExpressionsInTree(initialTree))

        let plusExpression = compressedExpressions.find(expr => expr.operator == "+");
        assert(plusExpression != null && plusExpression.operands.length == 4)

        let multiplicationExpression = compressedExpressions.find(expr => expr.operator == "*");
        assert(multiplicationExpression != null && multiplicationExpression.operands.length == 4)
    });

});
