import createWords from './createWords'
import { createTree, translateTree } from './createTree'

export default function (str) {
    var words = createWords(str)
    var tree = createTree(words)
    var content = translateTree(tree)
    return content
}