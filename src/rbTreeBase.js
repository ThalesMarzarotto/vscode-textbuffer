"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.SENTINEL = exports.TreeNode = void 0;
exports.leftest = leftest;
exports.righttest = righttest;
exports.calculateSize = calculateSize;
exports.calculateLF = calculateLF;
exports.resetSentinel = resetSentinel;
exports.leftRotate = leftRotate;
exports.rightRotate = rightRotate;
exports.rbDelete = rbDelete;
exports.fixInsert = fixInsert;
exports.updateTreeMetadata = updateTreeMetadata;
exports.recomputeTreeMetadata = recomputeTreeMetadata;
var TreeNode = /** @class */ (function () {
    function TreeNode(piece, color) {
        this.piece = piece;
        this.color = color;
        this.size_left = 0;
        this.lf_left = 0;
        this.parent = this;
        this.left = this;
        this.right = this;
    }
    TreeNode.prototype.next = function () {
        if (this.right !== exports.SENTINEL) {
            return leftest(this.right);
        }
        var node = this;
        while (node.parent !== exports.SENTINEL) {
            if (node.parent.left === node) {
                break;
            }
            node = node.parent;
        }
        if (node.parent === exports.SENTINEL) {
            return exports.SENTINEL;
        }
        else {
            return node.parent;
        }
    };
    TreeNode.prototype.prev = function () {
        if (this.left !== exports.SENTINEL) {
            return righttest(this.left);
        }
        var node = this;
        while (node.parent !== exports.SENTINEL) {
            if (node.parent.right === node) {
                break;
            }
            node = node.parent;
        }
        if (node.parent === exports.SENTINEL) {
            return exports.SENTINEL;
        }
        else {
            return node.parent;
        }
    };
    TreeNode.prototype.detach = function () {
        this.parent = null;
        this.left = null;
        this.right = null;
    };
    return TreeNode;
}());
exports.TreeNode = TreeNode;
exports.SENTINEL = new TreeNode(null, 0 /* NodeColor.Black */);
exports.SENTINEL.parent = exports.SENTINEL;
exports.SENTINEL.left = exports.SENTINEL;
exports.SENTINEL.right = exports.SENTINEL;
exports.SENTINEL.color = 0 /* NodeColor.Black */;
function leftest(node) {
    while (node.left !== exports.SENTINEL) {
        node = node.left;
    }
    return node;
}
function righttest(node) {
    while (node.right !== exports.SENTINEL) {
        node = node.right;
    }
    return node;
}
function calculateSize(node) {
    if (node === exports.SENTINEL) {
        return 0;
    }
    return node.size_left + node.piece.length + calculateSize(node.right);
}
function calculateLF(node) {
    if (node === exports.SENTINEL) {
        return 0;
    }
    return node.lf_left + node.piece.lineFeedCnt + calculateLF(node.right);
}
function resetSentinel() {
    exports.SENTINEL.parent = exports.SENTINEL;
}
function leftRotate(tree, x) {
    var y = x.right;
    // fix size_left
    y.size_left += x.size_left + (x.piece ? x.piece.length : 0);
    y.lf_left += x.lf_left + (x.piece ? x.piece.lineFeedCnt : 0);
    x.right = y.left;
    if (y.left !== exports.SENTINEL) {
        y.left.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === exports.SENTINEL) {
        tree.root = y;
    }
    else if (x.parent.left === x) {
        x.parent.left = y;
    }
    else {
        x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
}
function rightRotate(tree, y) {
    var x = y.left;
    y.left = x.right;
    if (x.right !== exports.SENTINEL) {
        x.right.parent = y;
    }
    x.parent = y.parent;
    // fix size_left
    y.size_left -= x.size_left + (x.piece ? x.piece.length : 0);
    y.lf_left -= x.lf_left + (x.piece ? x.piece.lineFeedCnt : 0);
    if (y.parent === exports.SENTINEL) {
        tree.root = x;
    }
    else if (y === y.parent.right) {
        y.parent.right = x;
    }
    else {
        y.parent.left = x;
    }
    x.right = y;
    y.parent = x;
}
function rbDelete(tree, z) {
    var x;
    var y;
    if (z.left === exports.SENTINEL) {
        y = z;
        x = y.right;
    }
    else if (z.right === exports.SENTINEL) {
        y = z;
        x = y.left;
    }
    else {
        y = leftest(z.right);
        x = y.right;
    }
    if (y === tree.root) {
        tree.root = x;
        // if x is null, we are removing the only node
        x.color = 0 /* NodeColor.Black */;
        z.detach();
        resetSentinel();
        tree.root.parent = exports.SENTINEL;
        return;
    }
    var yWasRed = (y.color === 1 /* NodeColor.Red */);
    if (y === y.parent.left) {
        y.parent.left = x;
    }
    else {
        y.parent.right = x;
    }
    if (y === z) {
        x.parent = y.parent;
        recomputeTreeMetadata(tree, x);
    }
    else {
        if (y.parent === z) {
            x.parent = y;
        }
        else {
            x.parent = y.parent;
        }
        // as we make changes to x's hierarchy, update size_left of subtree first
        recomputeTreeMetadata(tree, x);
        y.left = z.left;
        y.right = z.right;
        y.parent = z.parent;
        y.color = z.color;
        if (z === tree.root) {
            tree.root = y;
        }
        else {
            if (z === z.parent.left) {
                z.parent.left = y;
            }
            else {
                z.parent.right = y;
            }
        }
        if (y.left !== exports.SENTINEL) {
            y.left.parent = y;
        }
        if (y.right !== exports.SENTINEL) {
            y.right.parent = y;
        }
        // update metadata
        // we replace z with y, so in this sub tree, the length change is z.item.length
        y.size_left = z.size_left;
        y.lf_left = z.lf_left;
        recomputeTreeMetadata(tree, y);
    }
    z.detach();
    if (x.parent.left === x) {
        var newSizeLeft = calculateSize(x);
        var newLFLeft = calculateLF(x);
        if (newSizeLeft !== x.parent.size_left || newLFLeft !== x.parent.lf_left) {
            var delta = newSizeLeft - x.parent.size_left;
            var lf_delta = newLFLeft - x.parent.lf_left;
            x.parent.size_left = newSizeLeft;
            x.parent.lf_left = newLFLeft;
            updateTreeMetadata(tree, x.parent, delta, lf_delta);
        }
    }
    recomputeTreeMetadata(tree, x.parent);
    if (yWasRed) {
        resetSentinel();
        return;
    }
    // RB-DELETE-FIXUP
    var w;
    while (x !== tree.root && x.color === 0 /* NodeColor.Black */) {
        if (x === x.parent.left) {
            w = x.parent.right;
            if (w.color === 1 /* NodeColor.Red */) {
                w.color = 0 /* NodeColor.Black */;
                x.parent.color = 1 /* NodeColor.Red */;
                leftRotate(tree, x.parent);
                w = x.parent.right;
            }
            if (w.left.color === 0 /* NodeColor.Black */ && w.right.color === 0 /* NodeColor.Black */) {
                w.color = 1 /* NodeColor.Red */;
                x = x.parent;
            }
            else {
                if (w.right.color === 0 /* NodeColor.Black */) {
                    w.left.color = 0 /* NodeColor.Black */;
                    w.color = 1 /* NodeColor.Red */;
                    rightRotate(tree, w);
                    w = x.parent.right;
                }
                w.color = x.parent.color;
                x.parent.color = 0 /* NodeColor.Black */;
                w.right.color = 0 /* NodeColor.Black */;
                leftRotate(tree, x.parent);
                x = tree.root;
            }
        }
        else {
            w = x.parent.left;
            if (w.color === 1 /* NodeColor.Red */) {
                w.color = 0 /* NodeColor.Black */;
                x.parent.color = 1 /* NodeColor.Red */;
                rightRotate(tree, x.parent);
                w = x.parent.left;
            }
            if (w.left.color === 0 /* NodeColor.Black */ && w.right.color === 0 /* NodeColor.Black */) {
                w.color = 1 /* NodeColor.Red */;
                x = x.parent;
            }
            else {
                if (w.left.color === 0 /* NodeColor.Black */) {
                    w.right.color = 0 /* NodeColor.Black */;
                    w.color = 1 /* NodeColor.Red */;
                    leftRotate(tree, w);
                    w = x.parent.left;
                }
                w.color = x.parent.color;
                x.parent.color = 0 /* NodeColor.Black */;
                w.left.color = 0 /* NodeColor.Black */;
                rightRotate(tree, x.parent);
                x = tree.root;
            }
        }
    }
    x.color = 0 /* NodeColor.Black */;
    resetSentinel();
}
function fixInsert(tree, x) {
    recomputeTreeMetadata(tree, x);
    while (x !== tree.root && x.parent.color === 1 /* NodeColor.Red */) {
        if (x.parent === x.parent.parent.left) {
            var y = x.parent.parent.right;
            if (y.color === 1 /* NodeColor.Red */) {
                x.parent.color = 0 /* NodeColor.Black */;
                y.color = 0 /* NodeColor.Black */;
                x.parent.parent.color = 1 /* NodeColor.Red */;
                x = x.parent.parent;
            }
            else {
                if (x === x.parent.right) {
                    x = x.parent;
                    leftRotate(tree, x);
                }
                x.parent.color = 0 /* NodeColor.Black */;
                x.parent.parent.color = 1 /* NodeColor.Red */;
                rightRotate(tree, x.parent.parent);
            }
        }
        else {
            var y = x.parent.parent.left;
            if (y.color === 1 /* NodeColor.Red */) {
                x.parent.color = 0 /* NodeColor.Black */;
                y.color = 0 /* NodeColor.Black */;
                x.parent.parent.color = 1 /* NodeColor.Red */;
                x = x.parent.parent;
            }
            else {
                if (x === x.parent.left) {
                    x = x.parent;
                    rightRotate(tree, x);
                }
                x.parent.color = 0 /* NodeColor.Black */;
                x.parent.parent.color = 1 /* NodeColor.Red */;
                leftRotate(tree, x.parent.parent);
            }
        }
    }
    tree.root.color = 0 /* NodeColor.Black */;
}
function updateTreeMetadata(tree, x, delta, lineFeedCntDelta) {
    // node length change or line feed count change
    while (x !== tree.root && x !== exports.SENTINEL) {
        if (x.parent.left === x) {
            x.parent.size_left += delta;
            x.parent.lf_left += lineFeedCntDelta;
        }
        x = x.parent;
    }
}
function recomputeTreeMetadata(tree, x) {
    var delta = 0;
    var lf_delta = 0;
    if (x === tree.root) {
        return;
    }
    if (delta === 0) {
        // go upwards till the node whose left subtree is changed.
        while (x !== tree.root && x === x.parent.right) {
            x = x.parent;
        }
        if (x === tree.root) {
            // well, it means we add a node to the end (inorder)
            return;
        }
        // x is the node whose right subtree is changed.
        x = x.parent;
        delta = calculateSize(x.left) - x.size_left;
        lf_delta = calculateLF(x.left) - x.lf_left;
        x.size_left += delta;
        x.lf_left += lf_delta;
    }
    // go upwards till root. O(logN)
    while (x !== tree.root && (delta !== 0 || lf_delta !== 0)) {
        if (x.parent.left === x) {
            x.parent.size_left += delta;
            x.parent.lf_left += lf_delta;
        }
        x = x.parent;
    }
}
