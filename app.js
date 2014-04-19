/**
 * Created by n0v0leg on 19.04.14.
 */
var n = 3;
var properties = {
    none: 0,
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
var p = [0,1,2,3];
permute(p, 0);
permutations.shift();
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
    flags = properties.none;
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

/**
 * generation of all possible permutations
 * @param {Array} p
 * @param {number} k
 */
function permute(p, k) {
    k++;
    var i;
    if (k == n) {
        permutations.push(p);
    } else {
        for (i = k; i < n; i++) {
            var temp;
            temp = p[k];
            p[k] = p[i];
            p[i] = temp;
            permute(p, k);
            temp = p[k];
            p[k] = p[i];
            p[i] = temp;
        }
    }
}
