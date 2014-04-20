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
    reflexivity: {
        for (i = 0; i < n; i++)
            if (!b[i][i])
                break reflexivity;
        flags |= properties.reflexivity;
    }
    antisymmetry: {
        for (i = 1; i < n; i++)
            for (j = 0; j < i; j++)
                if (b[i][j] && b[j][i])
                    break antisymmetry;
        flags |= properties.antisymmetry;
    }
    transitivity: {
        for (i = 0; i < n; i++)
            for (j = 0; j < n; j++)
                if (!b[i][j])
                    for (k = 0; k < n; k++)
                        if (b[i][k] && b[k][j])
                            break transitivity;
        flags |= properties.transitivity;
    }
    var subgroup = [];
    for (k = 0; k < permutations.length; k++) {
        automorphism: {
            for (i = 0; i < n; i++)
                for (j = 0; j < n; j++)
                    if (b[i][j] != b[permutations[k][i]][permutations[k][j]])
                        break automorphism;
            subgroup.push(permutations[k]);
        }
    }
    if (subgroup.length != 0) {
        searching: {
            for (i = 0; i < results[flags].length; i++) {
                equality: {
                    if (results[flags][i].length == subgroup.length + 1) {
                        for (j = 0; j < subgroup.length; j++)
                            for (k = 0; k < n; k++)
                                if (results[flags][i][j][k] != subgroup[j][k])
                                    break equality;
                        results[flags][i][subgroup.length]++;
                        break searching;
                    }
                }
            }
            subgroup.push(1);
            results[flags].push(subgroup);
        }
    }
}

var sum = 0;
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
        sum += results[flags][i][j];
    }
}
if (sum == Math.pow(2, n * n)){
    console.log('computing finished');
} else {
    console.error('computing finished with errors');
}
console.timeEnd('time');

/**
 * generation of all possible permutations
 * @param {Array} p
 * @param {number} k
 */
function permute(p, k) {
    var i;
    if (k + 1 == n) {
        var newP = [];
        for (i = 0; i < n; i++) {
            newP[i] = p[i];
        }
        permutations.push(newP);
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
