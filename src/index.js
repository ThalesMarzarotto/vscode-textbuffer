"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pieceTreeBuilder_1 = require("./pieceTreeBuilder");
var pieceTreeTextBufferBuilder = new pieceTreeBuilder_1.PieceTreeTextBufferBuilder();
pieceTreeTextBufferBuilder.acceptChunk('abc\ndef\n');
pieceTreeTextBufferBuilder.acceptChunk('def');
pieceTreeTextBufferBuilder.acceptChunk('def\n');
pieceTreeTextBufferBuilder.acceptChunk('def\n');
pieceTreeTextBufferBuilder.acceptChunk('def\n');
var pieceTreeFactory = pieceTreeTextBufferBuilder.finish(true);
var pieceTree = pieceTreeFactory.create(1 /* DefaultEndOfLine.LF */);
pieceTree.getLineCount(); // 2
pieceTree.insert(10, '+');
// pieceTree.getLineContent(1); // 'a+bc'
pieceTree.getLineContent(2); // 'def'
// console.log(pieceTree.getLineContent(3));
// console.log("hi")
