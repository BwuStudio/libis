import createWords from './createWords'
import { createTree, translateTree } from './createTree'

export default function (str) {
    var words = createWords(str)
    // console.log(words)
    var tree = createTree(words)
    // console.log(tree)
    var content = translateTree(tree)
    // console.log(content)
    return content
}