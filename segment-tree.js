// function dummySegmentTree(array, fn, N) {
//     return function (from, to) {
//         let result = N;
//         for (let i = from; i < to; i++) {
//             result = fn(result, array[i]);
//         }
//         return result;
//     }
// }

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

    return function (from, to) {

        for (let i = 0; i < (array.length * 16); i++){
            t[i] = new Array(array.length * 16);
        }

        if (from < 0 || array.length < to){
            throw new Error("Out of range");
        }
        if (to < from) {
            throw new Error("From is greater");
        }
        if (from == to) { return N; }

        let result = N;
        if (array[0][0] instanceof Array) {
        // if (Array.isArray(array[0][0]) == true) {          // == true
            // }else if (array[0][0].length > 0){
            //     console.log("array length: " + array[0][0].length);

            for (let i = 0; i < (array.length * 16); i++){
                for (let j = 0; j < (array[0].length * 16); j++){
                    t[i][j] = new Array(array[0].length * 16);
                    // t[i][j] = new Array(array.length * 16);
                }
            }

            buildThree_Z(1, 0, array.length - 1, array, fn);       //rz = 3

            return function(from1, to1){
                return function(from2, to2){

                    return sum_x(1, 0, array.length - 1, from, to - 1, from1, to1 - 1, from2, to2 - 1, N, array, fn);
                }
            }
        } else if (array[0] instanceof Array){
        // } else if (Array.isArray(array[0]) == true){

            for (let i = 0; i < (array.length * 16); i++){
                t[i] = new Array(array.length * 16);
            }

            build_X(1, 0, array.length - 1, array, fn);

            return function(from1, to1){
                return query(1, 0, array.length - 1, from, to - 1, from1, to1 - 1, array, N, fn);
            }
        } else if (array instanceof Array){
        // } else if (Array.isArray(array[0]) == false){

            buildOneDTree(1, 0, array.length - 1, array, fn, N);

            return queryOneDTree(1, 0, array.length - 1, from, to - 1, N, fn);

        }

        return result;
    };
};

function getElfTree(array) {
    return recursiveSegmentTree(array, sum, 0);
};

function minimumData(array) {

    let minGems = 1000;
    let whoHasLessGems = 0;

    for (let index = 0; index < array.length; index++){

        array[index] < minGems ? minGems = array[index] : minGems;

    }

    return minGems;
}

function assignEqually(tree, wishes, stash, elves, gems, week) {

    let assignment = {};

    let gemsCount = [];

    // console.log(elves);
    // console.log(stash);

    for (let i = 0; i < elves.length; i++){
        // let tmp = temp = tree(i, i + 1)(0, gems.length)(0, week);
        let tmp = tree(i, i + 1)(0, gems.length)(0, week);
        gemsCount.push(tmp);
    }

    for (gem in stash){
        for (let i = 0; i < stash[gem]; i++){
            let minGems = minimumData(gemsCount);               //smallest quantity of gems
            let hasMinNum = gemsCount.indexOf(minGems);            //who has less gems
            if (assignment[elves[hasMinNum]] == null) { assignment[elves[hasMinNum]] = {}; }

            if (assignment[elves[hasMinNum]][gem] == null) {
                assignment[elves[hasMinNum]][gem] = 0;
            }
            assignment[elves[hasMinNum]][gem]++;
            gemsCount[hasMinNum]++;
        }
    }

    // console.log(assignment);
    // console.log("///***///***///***");
    return assignment;

};

function assignAtLeastOne(tree, wishes, stash, elves, gems, week) {

    let assignment = {};

    let gemsCount = [];

    // console.log(elves);
    // console.log("gems = " + gems);
    // console.log("week = " + week);
    // console.log(stash);

    for (let i = 0; i < elves.length; i++){
        let tmp = tree(i, i + 1)(0, gems.length)(0, week);
        gemsCount.push(tmp);
    }

    for (gem in stash){
        for (let i = 0; i < stash[gem]; i++){
            let minGems = minimumData(gemsCount);               //smallest quantity of gems
            let hasMinNum = gemsCount.indexOf(minGems);            //who has less gems
            if (assignment[elves[hasMinNum]] == null) {
                assignment[elves[hasMinNum]] = {};
            }
            if (assignment[elves[hasMinNum]][gem] == null) {
                assignment[elves[hasMinNum]][gem] = 0;
            }
            assignment[elves[hasMinNum]][gem]++;
            gemsCount[hasMinNum]++;
        }
    }

    console.log(assignment);
    console.log("///***///***///***");
    return assignment;
}


function assignPreferredGems(tree, wishes, stash, elves, gems) {
    let result = {};
    for (gem in stash) {

        let elvesWishes = elves.map(elf => wishes[elves.indexOf(elf)][gems.indexOf(gem)])

        elvesWishes = elvesWishes.map(ew => 1 - ew);

        let minGems = minimumData(elvesWishes);
        let hasMinNum = elvesWishes.indexOf(minGems);
        if (result[elves[hasMinNum]] == null){
            result[elves[hasMinNum]] = {};
        }
        if (result[elves[hasMinNum]][gem] == null)
        {
            result[elves[hasMinNum]][gem] = 0;
        }
        // result[elves[hasMinNum]][gem] += stash[gem];
        result[elves[hasMinNum]][gem] += stash[gem];
    }
    return result;
}

function nextState(state, assignment, elves, gems) {
    for (let elf = 0; elf < state.length; elf++){
        for (let gem = 0; gem < state[elf].length; gem++){

            elves[elf] in assignment && gems[gem] in assignment[elves[elf]] ?
                state[elf][gem].push(assignment[elves[elf]][gems[gem]]) : state[elf][gem].push(0);

        }
    }
    return state;

}
