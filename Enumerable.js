function Enum(array) {

    // internal array variable
    var _ary = array;

    //getter for internal array variable

    this.toArray = function() {
        return _ary;
    }

    /* private utililty functions begin */


    // this function returns a deep copy of the injected argument
    var copy = function(ary) {
        var arr = [];
        for (var i = 0; i <= ary.length - 1; i++) {
            arr[i] = ary[i];
        }
        return arr;
    }; // end copy

    // this function injects an element into the internal array variable and cycles the new element in all possible positions

    var cycle = function(element) {
        if (arguments[1]) {
            var ref = copy(arguments[1]);
            var arr = copy(ref);
        } else {
            var ref = copy(_ary);
            var arr = copy(ref);
        }
        var result = [];
        for (var i = 0; i <= ref.length; i++) {
            ref.splice(arr.length - i, 0, element);
            result.push(copy(ref));
            ref = copy(arr);
        }
        return result;
    }; // end cycle


    //this function checks to see if an element is contained within a collection
    var contains = function(arr, element) {
        var found = false;
        arr.forEach(function(i) {
            if (i == element) {
                found = true;
            } else if (i instanceof Object && i.toString() === element.toString()) {
                found = true;
            }
        });
        return found;
    } //end contains

    //this function returns an array with no repeated elements

    var unique = function(arr) {
        var uniq = [];
        for (var i = 0; i < arr.length; i++) {
            if (!contains(uniq, arr[i])) {
                uniq.push(arr[i]);
            }
        }
        return uniq;
    } //end unique


    // this function calculates the factorial of a given number

        function factorial(n) {
            if (n == 1) {
                return 1;
            } else {
                return n * factorial(n - 1);
            }
        }

        // this function returns all possible arrangements of an array's elements

    var _permutation = function(arr) {
        if (Array.isArray(arr)) {
            if (arr.length == 1 || arr.length == 0) {
                return arr;
            } else if (arr.length == 2) {
                return [arr, arr.copy().reverse()];
            } else if (arr.length == 3) {
                return [[arr[0], arr[1], arr[2]], [arr[0], arr[2], arr[1]], [arr[2], arr[0], arr[1]], [arr[0], arr[1], arr[2]].reverse(), [arr[0], arr[2], arr[1]].reverse(), [arr[2], arr[0], arr[1]].reverse()];
            } else {
                var nums = copy(arr);
                var init = arr.splice(-3, 3);
                var bigArr = _permutation(init);
                var overflow = arr;
                var result = [];
                var temp;
                arr = copy(nums);
                for (var i = 0; i < overflow.length; i++) {
                    bigArr.forEach(function(n) {
                        temp = cycle(overflow[i], n);
                        temp.forEach(function(j) {
                            result.push(j);
                        }) //end inner forEach
                    }) //end outer forEach		
                    bigArr = result;
                }
                return bigArr.splice(-factorial(nums.length), factorial(nums.length));
            }
        }
        return;
    } //end _permutation

    /* private utility functions end */


    // returns an array of all arrangements of the elements within the enum object; need to change return type to ensure consistency 
    this.permutation = function() {
        return _permutation(copy(_ary));
    } //end permutation


    // returns an array of unique elements ; need to change return type to ensure consistency

    this.uniq = function() {
        return unique(_ary);
    } // end unique 

    // returns a boolean to indicate the presence of an element

    this.includes = function(element) {
        return contains(_ary, element);
    } // end includes


    // flattens the array by one level. Can be called recursively for more levels//
    this.flatten = function() {
        var arr = copy(_ary);
        if (Array.isArray(arr[0]) && arr.length == 1) {
            return arr[0];
        } else if (arr.some(function(n) {
            return Array.isArray(n)
        }) && arr.length > 1) {
            var temp = [];
            arr.forEach(function(n) {
                if (Array.isArray(n)) {
                    n.forEach(function(j) {
                        temp.push(j);
                    });
                } else {
                    temp.push(n);
                }
            });
            return temp;
        } else {
            return arr;
        }
    } // end flatten method


    // setting up the cache for the count method; will remove public access to the cache in final version
    this.getCountarr = function() {
        if (this.countarr) {
            return this.countarr;
        } else {
            this.countarr = {};
            return this.countarr;
        }
    };
    this.countarr = this.getCountarr();

    //this method returns the number of occurences of a given element

    this.count = function(e) {
        if (Object.keys(this.getCountarr()).length > 0) {

            return this.countarr[e];
        }
        if (contains(e)) {
            var x = {};
            _ary.forEach(function(n, i) {
                if (!x[n]) x[n] = 1;
                else {
                    x[n] += 1;
                }
            });
            this.countarr = x;
            return this.countarr[e];
        }
        return;
    };
    //this function returns an enumerator object with a randomized internal array
    // the returned object is guaranteed to contain the original elements
    // because it is iterated over the original array length & indexed by the unique indices of the original array 
    // whereas the range of possible random indices is adjusted indirectly by the splice method
    //
    this.shuffle = function() {
        var _shuffle = [];
        var cp = copy(_ary);
        _ary.forEach(function(n, i) {
            _shuffle[i] = cp.splice(Math.round(Math.random() * (cp.length - 1)), 1)[0];

        })
        return new Enum(_shuffle);
    }


    //this function returns a random sample of n elements from the array; returns 1 single element with no arguments passed.
    //the shuffle method is used to guarantee that the returned sample does not have erroneous repetitions    

    this.sample = function(n) {
        var _shuffle = this.shuffle().toArray();
        if (n && n <= _shuffle.length) {
            return _shuffle.splice(0, n);
        }
        return _shuffle.pop(0, 1);
    }
    //TODO: sample and shuffle methods
} //end Enum Constructor