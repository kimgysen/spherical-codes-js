// Stages
// build
// transformation
// extension
// composition
// resolutionStage
// eliminationStage

type OperatorSymbol = {
	add: '+',
	subtract: '-',
	multiply: '*',
	divide: '/',
}

type PrecedenceOperator = {
	open: '(',
	close: ')'
}

enum FunctionType {SIN, COS, TAN}

enum ConstantSymbol {
	PI
}

enum ConstantType {NUMERIC, SYMBOL}

enum VariableType {NUMERIC, ANGLE}

enum ExpressionType {
	FUNCTION_CALL,
	ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION
}

type Function = {
	type: FunctionType;
	param: AlgebraicExpression;
}

type ExpressionItemType {
	constant: ConstantType, // 1, 2, 3, PI
	Function, // cos, sin, tan...
	Variable, // x, y, z
	Angle
}

enum ExpressionType {UNARY, BINARY}

type LikeTerm = {

}

type ExpressionTerm = {
	type: ExpressionType;
	value: number| string;
}

type AlgebraicExpression = {
	terms: ExpressionTerm[];
}

interface AlgebraicEquation {
	left: AlgebraicExpression;
	right: AlgebraicExpression;
}
