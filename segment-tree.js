
function dummySegmentTree(array, fn, N) {
    return function (from, to) {
        let result = N;
        for (let i = from; i < to; i++) {
            result = fn(result, array[i]);
        }
        return result;
    }
}

var t = new Array();

//building X1D segment tree
function buildOneDTree(v, vleft, vright, array, fn, N) {
    if (vleft == vright){
        t[v] = array[vleft];
        return;
    }

    let vmiddle = Math.floor(vleft + (vright - vleft) / 2);
    buildOneDTree(2 * v, vleft, vmiddle, array, fn, N);
    buildOneDTree(2 * v + 1, vmiddle + 1, vright, array, fn, N);
    t[v] = fn(t[2 * v], t[2 * v + 1]);
}
//sum of X1D segment tree
function queryOneDTree(v, vleft, vright, from, to, N, fn) {
    if (to < vleft || vright < from){
        return N;
    }
    if (vleft >= from && vright <= to){
        return t[v];
    }
    let vmiddle = Math.floor(vleft + (vright - vleft) / 2);
    let ql = queryOneDTree(2 * v, vleft, vmiddle, from, to, N, fn);
    let qr = queryOneDTree(2 * v + 1, vmiddle + 1, vright, from, to, N, fn);
    let res = fn(ql, qr);
    return fn(N, res);
}

function segmentTree(array, fn, N) {

    return function (from, to) {
        if (from < 0 || array.length < to){

            throw new Error("Out of range");
        }
        if (to < from) {
            throw new Error("From is greater");
        }
        if (from == to) { return N; }

        buildOneDTree(1, 0, array.length - 1, array, fn, N);

        result = queryOneDTree(1, 0, array.length - 1, from, to - 1, N, fn);

        return result;
    };
};

function recursiveSegmentTree(array, fn, N) {

    var t = new Array(array.length * 16);

    //Building X2D segment tree
    function build_Y(vx, lx, rx, vy, ly, ry, array){
        if (ly == ry){
            if (lx == rx){
                t[vx][vy] = array[lx][ly];
            }else{
                t[vx][vy] = fn(t[2 * vx][vy], t[2 * vx + 1][vy]);
            }
        }else{
            let vmiddleY = Math.floor((ry + ly) / 2);
            build_Y(vx, lx, rx, 2 * vy, ly, vmiddleY, array);
            build_Y(vx, lx, rx, 2 * vy + 1, vmiddleY + 1, ry, array);
            t[vx][vy] = fn(t[vx][2 * vy], t[vx][2 * vy + 1]);
        }
    }

    function build_X(vx, lx, rx, array){
        if (lx != rx){
            let vmiddleX = Math.floor((rx + lx) / 2);
            build_X(2 * vx, lx, vmiddleX, array);
            build_X(2 * vx + 1, vmiddleX + 1, rx, array);
        }
        build_Y(vx, lx, rx, 1, 0, array.length - 1, array);
    }

    //Calculating sum
    function finalQuery(pos, start, end, x1, x2, node, array, N){
        if (x2 < start || x1 > end){
            return N;
        }
        if (x1 <= start && end <= x2){
            return t[node][pos];
        }
        let mid = Math.floor((start + end) / 2);
        let p1 = finalQuery(2 * pos, start, mid, x1, x2, node, array, N);
        let p2 = finalQuery(2 * pos + 1, mid + 1, end, x1, x2, node, array, N);
        let result = fn(p1, p2);
        return fn(N, result);
    }

    function query(pos, start, end, y1, y2, x1, x2, array, N){
        if (y2 < start || end < y1){
            return N;
        }
        if (y1 <= start && end <= y2) {
            return finalQuery(1, 0, array.length - 1, x1, x2, pos, array, N);
        }
        let mid = Math.floor((start + end) / 2);
        let p1 = query(2 * pos, start, mid, y1, y2, x1, x2, array, N);
        let p2 = query(2 * pos + 1, mid + 1, end, y1, y2, x1, x2, array, N);
        let result = fn(p1, p2);
        return fn(N, result);
    }
    for (let i = 0; i < (array.length * 16); i++){
        t[i] = new Array(array.length * 16);
    }

    return function (from, to) {

        if (from < 0 || array.length < to){
            throw new Error("Out of range");
        }
        if (to < from) {
            throw new Error("From is greater");
        }
        if (from == to) { return N; }

        let result = N;
        if (Array.isArray(array[0]) == false){

            buildOneDTree(1, 0, array.length - 1, array, fn, N);

            return queryOneDTree(1, 0, array.length - 1, from, to - 1, N, fn);

        } else if (Array.isArray(array[0])){

            build_X(1, 0, array.length - 1, array);

            return function(from1, to1){
                return query(1, 0, array.length - 1, from, to - 1, from1, to1 - 1, array, N);
            }

        }else if (Array.isArray(array[0][0])){
        }

        return result;
    };
};

function getElfTree(array) {
    return recursiveSegmentTree(array, sum, 0);
};

function assignEqually(tree, wishes, stash, elves, gems, week) {
    return {};
};

function assignAtLeastOne(tree, wishes, stash, elves, gems, week) {
    return {};
};

function assignPreferredGems(tree, wishes, stash, elves, gems) {
    return {};
};

function nextState(state, assignment, elves, gems) {
    return state;
};