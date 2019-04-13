function buildOneDTree(v, vleft, vright, array, fn, N, t) {
    if (vleft == vright){
        t[v] = array[vleft];
        return;
    }

    let vmiddle = Math.floor(vleft + (vright - vleft) / 2);
    buildOneDTree(2 * v, vleft, vmiddle, array, fn, N, t);
    buildOneDTree(2 * v + 1, vmiddle + 1, vright, array, fn, N, t);
    t[v] = fn(t[2 * v], t[2 * v + 1]);
}

//sum of X1D segment tree
function queryOneDTree(v, vleft, vright, from, to, N, fn, t) {
    if (to < vleft || vright < from){
        return N;
    }
    if (vleft >= from && vright <= to){
        return t[v];
    }
    let vmiddle = Math.floor(vleft + (vright - vleft) / 2);
    let ql = queryOneDTree(2 * v, vleft, vmiddle, from, to, N, fn, t);
    let qr = queryOneDTree(2 * v + 1, vmiddle + 1, vright, from, to, N, fn, t);
    let res = fn(ql, qr);
    return fn(N, res);
}