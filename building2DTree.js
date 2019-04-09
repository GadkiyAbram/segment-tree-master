function build_Y(vx, lx, rx, vy, ly, ry, array, fn){
    if (ly == ry){
        if (lx == rx){
            t[vx][vy] = array[lx][ly];
        }else{
            t[vx][vy] = fn(t[2 * vx][vy], t[2 * vx + 1][vy]);
        }
    }else{
        let vmiddleY = Math.floor(ly + (ry - ly) / 2);

        build_Y(vx, lx, rx, 2 * vy, ly, vmiddleY, array, fn);
        build_Y(vx, lx, rx, 2 * vy + 1, vmiddleY + 1, ry, array, fn);
        t[vx][vy] = fn(t[vx][2 * vy], t[vx][2 * vy + 1]);
    }
}

function build_X(vx, lx, rx, array, fn){
    if (lx != rx){
        let vmiddleX = Math.floor((rx + lx) / 2);
        build_X(2 * vx, lx, vmiddleX, array, fn);
        build_X(2 * vx + 1, vmiddleX + 1, rx, array, fn);
    }
    build_Y(vx, lx, rx, 1, 0, array[0].length - 1, array, fn);     //array.length - 1
}

//Calculating sum
function finalQuery(pos, start, end, x1, x2, node, array, N, fn){
    if (x2 < start || x1 > end){
        return N;
    }
    if (x1 <= start && end <= x2){
        return t[node][pos];
    }
    let mid = Math.floor((start + end) / 2);
    let p1 = finalQuery(2 * pos, start, mid, x1, x2, node, array, N, fn);
    let p2 = finalQuery(2 * pos + 1, mid + 1, end, x1, x2, node, array, N, fn);
    let result = fn(p1, p2);
    return fn(N, result);
}

function query(pos, start, end, y1, y2, x1, x2, array, N, fn){
    if (y2 < start || end < y1){
        return N;
    }
    if (y1 <= start && end <= y2) {
        return finalQuery(1, 0, array[0].length - 1, x1, x2, pos, array, N, fn);       //array.length - 1
        // return finalQuery(pos, 0, array[0].length - 1, x1, x2, 1, array, N);
    }
    let mid = Math.floor((start + end) / 2);
    let p1 = query(2 * pos, start, mid, y1, y2, x1, x2, array, N, fn);
    let p2 = query(2 * pos + 1, mid + 1, end, y1, y2, x1, x2, array, N, fn);
    let result = fn(p1, p2);
    return fn(N, result);
}