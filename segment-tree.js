function dummySegmentTree(array, fn, N) {
    return function (from, to) {
        let result = N;
        for (let i = from; i < to; i++) {
            result = fn(result, array[i]);
        }
        return result;
    }
}
// function recursiveSegmentTree(array, fn, N) {
//
//     return function neutralTree(from, to) {
//
//         if (from < 0 || array.length < to){
//             throw new Error("Out of range");
//         }
//         if (to < from) {
//             throw new Error("From is greater");
//         }
//         if (from == to) { return N; }
//
//         let result = N;
//
//         array.slice(from, to).forEach((arr) => {
//             if (!Array.isArray(arr)) {
//                 result += arr;
//             }
//             else {
//                 result += fn(result, arr);
//             }
//         });
//
//         // console.log(result);
//
//         return result;
//     };
// };

function segmentTree(array, fn, N) {
    var t = new Array();
    function build(v, vleft, vright, array) {
        if (vleft == vright){
            t[v] = array[vleft];
            return;
        }

        let vmiddle = Math.floor(vleft + (vright - vleft) / 2);
        build(2 * v, vleft, vmiddle, array);
        build(2 * v + 1, vmiddle + 1, vright, array);
        t[v] = fn(t[2 * v], t[2 * v + 1]);
        return t;
    }
    
    function query(v, vleft, vright, from, to, N) {
        if (to < vleft || vright < from){
            return N;
        }
        if (vleft >= from && vright <= to){
            return t[v];
        }
        let vmiddle = Math.floor(vleft + (vright - vleft) / 2);
        let ql = query(2 * v, vleft, vmiddle, from, to, N);
        let qr = query(2 * v + 1, vmiddle + 1, vright, from, to, N);
        let res = fn(ql, qr);
        return fn(N, res);
    }
    return function (from, to) {
        if (from < 0 || array.length < to){

            throw new Error("Out of range");
        }
        if (to < from) {
            throw new Error("From is greater");
        }
        if (from == to) { return N; }

        t = build(1, 0, array.length - 1, array);

        let result = N;

        result = query(1, 0, array.length - 1, from, to - 1, N);
        return result;
    };
};

function recursiveSegmentTree(array, fn, N) {

    return function neutralTree(from, to) {

        if (from < 0 || array.length < to){
            throw new Error("Out of range");
        }
        if (to < from) {
            throw new Error("From is greater");
        }
        if (from == to) { return N; }

        let result = N;

        array.slice(from, to).forEach((arr) => {
            if (!Array.isArray(arr)) {
                result += arr;
            }
            else {
                result += fn(result, arr);
            }
        });

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