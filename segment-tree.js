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

    // Building X2D segment tree
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
        build_Y(vx, lx, rx, 1, 0, array[0].length - 1, array);     //array.length - 1
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
            return finalQuery(1, 0, array[0].length - 1, x1, x2, pos, array, N);       //array.length - 1
            // return finalQuery(pos, 0, array[0].length - 1, x1, x2, 1, array, N);
        }
        let mid = Math.floor((start + end) / 2);
        let p1 = query(2 * pos, start, mid, y1, y2, x1, x2, array, N);
        let p2 = query(2 * pos + 1, mid + 1, end, y1, y2, x1, x2, array, N);
        let result = fn(p1, p2);
        return fn(N, result);
    }


    // building 3D tree
    function buildThree_Y(vz, lz, rz, vx, lx, rx, vy, ly, ry, array){
        if (ly == ry){
            if (lx == rx && lz == rz){
                t[vz][vx][vy] = array[lz][lx][ly];
            }
            else if (lx == rx && lz != rz){
                t[vz][vx][vy] = fn(t[2 * vz][vx][vy], t[2 * vz + 1][vx][vy]);
            }
            else if (lx != rx && lz == rz){
                t[vz][vx][vy] = fn(t[vz][2 * vx][vy], t[vz][2 * vx + 1][vy]);
            }
            else if (lx != rx && lz != rz){
                t[vz][vx][vy] = fn(
                    fn(t[2 * vz][2 * vx][vy], t[2 * vz + 1][2 * vx][vy]),
                    fn(t[2 * vz][2 * vx + 1][vy], t[2 * vz + 1][2 * vx + 1][vy]));
            }
        }else{
            let vmiddleY = Math.floor(ly + (ry - ly) / 2);
            if (vmiddleY == -1){return;}                            //CHEAT!!!
            // console.log("vmiddleY = " + vmiddleY);
            buildThree_Y(vz, lz, rz, vx, lx, rx,2 * vy, ly, vmiddleY, array);
            buildThree_Y(vz, lz, rz, vx, lx, rx,2 * vy + 1, vmiddleY + 1, ry, array);
            t[vz][vx][vy] = fn(t[vz][vx][2 * vy], t[vz][vx][2 * vy + 1]);
        }
    }

    function buildThree_X(vz, lz, rz, vx, lx, rx, array){
        if (lx != rx){
            let vmiddleX = Math.floor((lx + rx) / 2);
            buildThree_X(vz, lz, rz, 2 * vx, lx, vmiddleX, array);
            buildThree_X(vz, lz, rz, 2 * vx + 1, vmiddleX + 1, rx, array);
        }
        buildThree_Y(vz, lz, rz, vx, lx, rx, 1, 0, array[0][0].length - 1, array);           //ry = 1
    }

    function buildThree_Z(vz, lz, rz, array){
        if (lz != rz){
            let vmiddleZ = Math.floor((lz + rz) / 2);
            buildThree_Z(2 * vz, lz, vmiddleZ, array);
            buildThree_Z(2 * vz + 1, vmiddleZ + 1, rz, array);
        }
        buildThree_X(vz, lz, rz, 1, 0, array[0].length - 1, array);       //rx = 3
    }

    function sum_z(vx, vy, vz, start, end, lz, rz, N, array){     //z
        if (rz < start || end < lz) { return N; }

        if (start >= lz && end <= rz){
            return t[vx][vy][vz];
        }
        let mid = Math.floor((start + end) / 2);
        let p1 = sum_z(vx, vy, 2 * vz, start, mid, lz, rz, N, array);
        let p2 = sum_z(vx, vy, 2 * vz + 1, mid + 1, end, lz, rz, N, array);
        let result = fn(p1, p2);
        return fn(N, result);
    }

    function sum_y(vx, vy, start, end, ly, ry, lz, rz, N, array){     //y, z
        if (ry < start || end < ly) { return N; }

        if(start >= ly && end <= ry)
        {
            return sum_z(vx, vy, 1, 0, array[0][0].length - 1, lz, rz, N, array);            //end 1
        }
        let mid = Math.floor((start + end) / 2 );
        let p1 = sum_y(vx, 2 * vy, start, mid, ly, ry, lz, rz, N, array);
        let p2 = sum_y(vx, 2 * vy + 1, mid + 1, end, ly, ry, lz, rz, N, array);
        let result = fn(p1, p2);
        return fn(N, result);
    }

    function sum_x(vx, start, end, lx, rx, ly, ry, lz, rz, N, array){     //y, x, z
        if (rx < start || end < lx) { return N; }

        if(lx <= start && end <= rx)
        {
            return sum_y(vx, 1,  0, array[0].length - 1, ly, ry, lz, rz, N, array);       //end = 3
        }
        let mid = Math.floor((start + end) / 2);
        let p1 = sum_x(2 * vx, start, mid, lx, rx, ly, ry, lz, rz, N, array);
        let p2 = sum_x(2 * vx  + 1, mid + 1, end, lx, rx, ly, ry, lz, rz, N, array);
        let result = fn(p1, p2);
        return fn(N, result);
    }

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
        if (Array.isArray(array[0]) == false){

            buildOneDTree(1, 0, array.length - 1, array, fn, N);

            return queryOneDTree(1, 0, array.length - 1, from, to - 1, N, fn);

        } else if (Array.isArray(array[0][0]) == false){

            build_X(1, 0, array.length - 1, array);

            return function(from1, to1){
                return query(1, 0, array.length - 1, from, to - 1, from1, to1 - 1, array, N);
            }

        }else if (Array.isArray(array[0][0])){          // == true

            for (let i = 0; i < (array.length * 16); i++){
                for (let j = 0; j < (array[0].length * 16); j++){
                        t[i][j] = new Array(array[0][0].length * 16);
                }
            }

            buildThree_Z(1, 0, array.length - 1, array);       //rz = 3

            return function(from1, to1){
                return function(from2, to2){

                    return sum_x(1, 0, array.length - 1, from, to - 1, from1, to1 - 1, from2, to2 - 1, N, array);
                }
            }
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
        if (array[index] < minGems){
            minGems = array[index];
            whoHasLessGems = index;
        }
    }

    return minGems;
}



function assignEqually(tree, wishes, stash, elves, gems, week) {

    let assignment = {};

    let gemsCount = [];

    console.log(elves);
    console.log(stash);

    for (let i = 0; i < elves.length; i++){
        let tmp = temp = tree(i, i + 1)(0, gems.length)(0, week);
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

    console.log(assignment);
    console.log("///***///***///***");
    return assignment;

};

function assignAtLeastOne(tree, wishes, stash, elves, gems, week) {

    let assignment = {};

    let gemsCount = [];

    console.log(elves);
    console.log(stash);

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

// function temporary(array) {
//     let tmpArr = [];
//     for (let j = 0; j < 4; j++){
//         let sum = 0;
//         for (let i = 0; i < 4; i++){
//             // sum += array[i][j];
//             // sum = 1 - sum;
//             console.log(array[i][j]);
//         }
//         tmpArr.push(sum);
//     }
//     console.log(tmpArr);
//     return tmpArr;
// }

function assignPreferredGems(tree, wishes, stash, elves, gems) {
    let result = {};
    for (gem in stash) {

        let elvesWishes = elves.map(elf => wishes[elves.indexOf(elf)][gems.indexOf(gem)])

        elvesWishes = elvesWishes.map(ew => 1 - ew);

        let min = minimumData(elvesWishes);
        let minIndex = elvesWishes.indexOf(min);
        if (result[elves[minIndex]] == null){
            result[elves[minIndex]] = {};
        }
        if (result[elves[minIndex]][gem] == null)
        {
            result[elves[minIndex]][gem] = 0;
        }
        result[elves[minIndex]][gem] += stash[gem];
    }
    return result;
}

function nextState(state, assignment, elves, gems) {

    for (let elf = 0; elf < state.length; elf++){
        for (let gem = 0; gem < state[elf].length; gem++){
            if (elves[elf] in assignment && gems[gem] in assignment[elves[elf]]) {
                state[elf][gem].push(assignment[elves[elf]][gems[gem]]);
            }else{
                state[elf][gem].push(0);
            }
        }
    }
    return state;

}