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
    var group = [];
    for (k = 0; k < permutations.length; k++) {
        var permutation = permutations[k];
        automorphism_checking: {
            for (i = 0; i < n; i++)
                for (j = 0; j < n; j++)
                    if (b[i][j] != b[permutation[i]][permutation[j]])
                        break automorphism_checking;
            group.push(permutation);
        }
    }
    if (group.length != 0) {
        searching: {
            var groups = results[flags];
            for (i = 0; i < groups.length; i++) {
                equality_checking: {
                    if (groups[i].length == group.length + 1) {
                        for (j = 0; j < group.length; j++)
                            for (k = 0; k < n; k++)
                                if (groups[i][j][k] != group[j][k])
                                    break equality_checking;
                        groups[i][group.length]++;
                        break searching;
                    }
                }
            }
            group.push(1);
            results[flags].push(group);
        }
    }
}

var fs = require('fs');
var filename = 'results' + n + '.txt';
for (flags = 0; flags < 8; flags++){
    for (var prop in properties){
        if (!(flags & properties[prop])){
            fs.appendFileSync(filename, 'no ');
        }
        fs.appendFileSync(filename, prop + '\n');
    }
    for (i = 0; i < results[flags].length; i++) {
        for (j = 0; j < results[flags][i].length - 1; j++) {
            for (k = 0; k < n; k++) {
                fs.appendFileSync(filename, results[flags][i][j][k] + 1);
            }
            fs.appendFileSync(filename, '\n');
        }
        fs.appendFileSync(filename, '(' + results[flags][i][j] + ')\n\n');
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
