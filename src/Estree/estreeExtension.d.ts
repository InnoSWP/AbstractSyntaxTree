import type { Program } from 'esprima';
import {Function,BaseExpression, Expression, BinaryOperator,Identifier, Literal, SwitchCase, CatchClause, VariableDeclarator, Statement, Property, AssignmentProperty, Super, TemplateElement, SpreadElement, Pattern, ClassBody, Class, MethodDefinition, ModuleDeclaration, ModuleSpecifier } from 'estree'

export type Node = 
Identifier | Literal | Program | Function | SwitchCase | CatchClause |
VariableDeclarator | Statement | Expression | Property |
AssignmentProperty | Super | TemplateElement | SpreadElement | Pattern |
ClassBody | Class | MethodDefinition | ModuleDeclaration | ModuleSpecifier 
| CompressedBinaryExpression;

export interface CompressedBinaryExpression extends BaseExpression {
    type: "CompressedBinaryExpression";
    operator: BinaryOperator;
    operands: Expression[];
  }
