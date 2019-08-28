import VDom from './VDom'

export default function Template() {
    var obj = {
        slot: function (_name, _vDoms) {
            var name = _name || ''
            var vDoms = _vDoms instanceof Array ? _vDoms : [_vDoms]
            return obj
        },
        callback:function(fn){
            return obj
        }
    }

    return obj
}
