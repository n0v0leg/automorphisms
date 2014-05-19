/**
 * Created by n0v0leg on 19.04.14.
 */
console.time('time');
var n = 4;
var properties = {
    reflexivity: 1,
    antisymmetry: 2,
    transitivity: 4
    };
var i, j, k, flags;
var permutation, group, groups;
var results = [];
for (flags = 0; flags < 8; flags++) {
    results[flags] = [];
}
var permutations = [];
var p = [];
for (i = 0; i < n; i++) {
    p[i] = i;
}
permute(p, 0);
//permutations.shift();
var b = [];
for (i = 0; i < n; i++) {
    b[i] = [];
}
var shift;
for (var value = 0; value < Math.pow(2, n * n); value++) {
    shift = value;
    for (i = 0; i < n; i++)
        for (j = 0; j < n; j++) {
            b[i][j] = !!(shift & 1);
            shift >>>= 1;
        }
    flags = 0;
    reflexivity_checking: {
        for (i = 0; i < n; i++)
            if (!b[i][i])
                break reflexivity_checking;
        flags |= properties.reflexivity;
    }
    antisymmetry_checking: {
        for (i = 1; i < n; i++)
            for (j = 0; j < i; j++)
                if (b[i][j] && b[j][i])
                    break antisymmetry_checking;
        flags |= properties.antisymmetry;
    }
    transitivity_checking: {
        for (i = 0; i < n; i++)
            for (j = 0; j < n; j++)
                if (!b[i][j])
                    for (k = 0; k < n; k++)
                        if (b[i][k] && b[k][j])
                            break transitivity_checking;
        flags |= properties.transitivity;
    }
    group = [1]; //first element will be a counter of equal groups
    for (k = 0; k < permutations.length; k++) {
        automorphism_checking: {
            for (i = 0; i < n; i++)
                for (j = 0; j < n; j++)
                    if (b[i][j] != b[permutations[k][i]][permutations[k][j]])
                        break automorphism_checking;
            group.push(k);
        }
    }
    searching: {
        groups = results[flags];
        for (i = 0; i < groups.length; i++) {
            equality_checking: {
                if (groups[i].length == group.length) {
                    for (j = 1; j < group.length; j++) //start from 1 to skip counter
                        if (groups[i][j] != group[j])
                            break equality_checking;
                    groups[i][0]++;
                    break searching;
                }
            }
        }
        groups.push(group);
    }
}

var fs = require('fs');
var filename = 'results' + n + '.txt';
for (flags = 0; flags < 8; flags++){
    groups = results[flags];
    for (var prop in properties){
        if (!(flags & properties[prop])){
            fs.appendFileSync(filename, 'no ');
        }
        fs.appendFileSync(filename, prop + '\n');
    }
    for (i = 0; i < groups.length; i++) {
        for (j = 1; j < groups[i].length; j++) {
            permutation = permutations[groups[i][j]];
            for (k = 0; k < n; k++) {
                fs.appendFileSync(filename, permutation[k] + 1);
            }
            fs.appendFileSync(filename, '\n');
        }
        fs.appendFileSync(filename, '(' + groups[i][0] + ')\n\n');
    }
}
console.log('computing finished');
console.timeEnd('time');

/**
 * generation of all possible permutations
 * @param {Array} p
 * @param {number} k
 */
function permute(p, k) {
    var i;
    if (k + 1 == n) {
        permutations.push(p.slice());
    } else {
        for (i = k; i < n; i++) {
            var temp;
            temp = p[k];
            p[k] = p[i];
            p[i] = temp;
            permute(p, k + 1);
            temp = p[k];
            p[k] = p[i];
            p[i] = temp;
        }
    }
}
