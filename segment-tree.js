var t = new Array(10);

function build(v, vleft, vright, array) {
    if (vleft == vright){
        t[v] = array[vleft];
        return;
    }

    let vmiddle = vleft + (vright - vleft) / 2;
    build(2 * v + 1, vleft, vmiddle, array);
    build(2 * v + 2, vmiddle + 1, vright, array);
    t[v] = t[2 * v + 1] + t[2 * v + 2];
}

function query(v, vleft, vright, from, to, fn, N) {
    if (to < vleft || vright < from){ return 0; }
    if (vleft >= from && vright <= to) { return fn(N, t[vleft]); }
    let vmiddle = vleft + (vright - vleft) / 2;
    let qleft = query(2 * v + 1, vleft, vmiddle, from, to, fn, N);
    let qright = query(2 * v + 2, vmiddle + 1, vright, from, to, fn, N);
    return fn(N, (qleft + qright));
}

function dummySegmentTree(array, fn, N) {

    return function (from, to) {
        let result = N;

        for (let i = from; i < to; i++) {
            result = fn(result, array[i]);
        }

        return result;
    }
}

function segmentTree(array, fn, N) {

    // return function neutralTree(from, to){
    //
    //     if (from < 0 || array.length < to){
    //         throw new Error("Out of range");
    //     }
    //     if (to < from) {
    //         throw new Error("From is greater");
    //     }
    //     if (from == to) { return N; }
    //     let result = N;
    //
    //     for (let i = from; i < to; i++) {
    //         result = fn(result, array[i]);
    //     }
    //
    //     return result;
    // };
    return function (from, to) {

        if (from < 0 || array.length < to){
            throw new Error("Out of range");
        }
        if (to < from) {
            throw new Error("From is greater");
        }
        if (from == to) { return N; }

        let result = N;

        return query(0, 0, array.length - 1, from, to, fn, N);
        // return result;
    };

};

function nextState(state, assignment, elves, gems) {
    return state;
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

        // console.log(result);

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
