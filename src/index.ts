import { DefaultEndOfLine, PieceTreeTextBufferBuilder } from './pieceTreeBuilder';



const pieceTreeTextBufferBuilder = new PieceTreeTextBufferBuilder();
pieceTreeTextBufferBuilder.acceptChunk('abc\ndef\n');

pieceTreeTextBufferBuilder.acceptChunk('def');
pieceTreeTextBufferBuilder.acceptChunk('def\n');
pieceTreeTextBufferBuilder.acceptChunk('def\n');
pieceTreeTextBufferBuilder.acceptChunk('def\n');
const pieceTreeFactory = pieceTreeTextBufferBuilder.finish(true);
const pieceTree = pieceTreeFactory.create(DefaultEndOfLine.LF);

pieceTree.getLineCount(); // 2


pieceTree.insert(10, '+');


// pieceTree.getLineContent(1); // 'a+bc'
pieceTree.getLineContent(2); // 'def'
// console.log(pieceTree.getLineContent(3));

// console.log("hi")