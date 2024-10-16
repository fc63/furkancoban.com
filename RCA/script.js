angular.module('RemComApp', [])
    .controller('RemComController', function($scope) {
        var RemCom = this;

        RemCom.arr = [];

        RemCom.preset = [];
        RemCom.preset["main"] = {
            com: "//",
            esc: "\\",
            bcopen: "/*",
            bcclose: "*/",
            comcheck: true,
            esccheck: true,
            bccheck: true
        };
        RemCom.preset["python"] = {
            com: "#",
            esc: "\\",
            bcopen: "'''",
            bcclose: "'''",
            comcheck: true,
            esccheck: true,
            bccheck: true
        };
        RemCom.preset["html"] = {
            com: null,
            esc: null,
            bcopen: "<!--",
            bcclose: "-->",
            comcheck: false,
            esccheck: false,
            bccheck: true
        };
        RemCom.preset["css"] = {
            com: null,
            esc: null,
            bcopen: "/*",
            bcclose: "*/",
            comcheck: false,
            esccheck: false,
            bccheck: true
        };
        RemCom.preset["sql"] = {
            com: "--",
            esc: null,
            bcopen: "/*",
            bcclose: "*/",
            comcheck: true,
            esccheck: false,
            bccheck: true
        };
        RemCom.preset["matlab"] = {
            com: "%",
            esc: null,
            bcopen: "%{",
            bcclose: "%}",
            comcheck: true,
            esccheck: false,
            bccheck: true
        };
        RemCom.preset["ruby"] = {
            com: "#",
            esc: "\\",
            bcopen: "=begin",
            bcclose: "=end",
            comcheck: true,
            esccheck: true,
            bccheck: true
        };

        $scope.RemCom.comment = "//";
        $scope.RemCom.esc = "\\";
        $scope.RemCom.bcopen = "/*";
        $scope.RemCom.bcclose = "*/";
        $scope.RemCom.comcheck = true;
        $scope.RemCom.esccheck = true;
        $scope.RemCom.bccheck = true;

        RemCom.getPreset = function($lang) {
            $scope.RemCom.comment = RemCom.preset[$lang].com;
            $scope.RemCom.esc = RemCom.preset[$lang].esc;
            $scope.RemCom.bcopen = RemCom.preset[$lang].bcopen;
            $scope.RemCom.bcclose = RemCom.preset[$lang].bcclose;
            $scope.RemCom.comcheck = RemCom.preset[$lang].comcheck;
            $scope.RemCom.esccheck = RemCom.preset[$lang].esccheck;
            $scope.RemCom.bccheck = RemCom.preset[$lang].bccheck;
        };

        RemCom.split = function() {
            var full = RemCom.appText;
            var finaltext = "";

            if (RemCom.bccheck && RemCom.bcopen != '') {
                var bcOpenIndexes = [],
                    bcCloseIndexes = [],
                    o = -1,
                    c = -1;
                while ((o = full.indexOf(RemCom.bcopen, o + 1)) != -1) {
                    bcOpenIndexes.push(o);
                }
                if (RemCom.bcclose != '') {
                    while ((c = full.indexOf(RemCom.bcclose, c + 1)) != -1) {
                        bcCloseIndexes.push(c);
                    }
                }

                var d = 0,
                    s = 0,
                    bc = 0,
                    record = 0;
                for (var i = 0; i < full.length; i++) {
                    if (full[i] == '"' && (!RemCom.esccheck || RemCom.esc == '' || full.substring(i - RemCom.esc.length, i) != RemCom.esc || (full.substring(i - RemCom.esc.length, i) == RemCom.esc && full.substring(i - 2 * RemCom.esc.length, i - RemCom.esc.length) == RemCom.esc)) && d == 0 && s == 0) {
                        d++;
                    } else if (full[i] == '"' && (!RemCom.esccheck || RemCom.esc == '' || full.substring(i - RemCom.esc.length, i) != RemCom.esc || (full.substring(i - RemCom.esc.length, i) == RemCom.esc && full.substring(i - 2 * RemCom.esc.length, i - RemCom.esc.length) == RemCom.esc)) && d == 1 && s == 0) {
                        d--;
                    }
                    if (full[i] == "'" && (!RemCom.esccheck || RemCom.esc == '' || full.substring(i - RemCom.esc.length, i) != RemCom.esc || (full.substring(i - RemCom.esc.length, i) == RemCom.esc && full.substring(i - 2 * RemCom.esc.length, i - RemCom.esc.length) == RemCom.esc)) && d == 0 && s == 0) {
                        if (bcOpenIndexes.indexOf(i) == -1) {
                            s++;
                        }
                    } else if (full[i] == "'" && (!RemCom.esccheck || RemCom.esc == '' || full.substring(i - RemCom.esc.length, i) != RemCom.esc || (full.substring(i - RemCom.esc.length, i) == RemCom.esc && full.substring(i - 2 * RemCom.esc.length, i - RemCom.esc.length) == RemCom.esc)) && d == 0 && s == 1) {
                        if (bcCloseIndexes.indexOf(i) == -1) {
                            s--;
                        }
                    } else if (full[i] == '\n') {
                        d = 0;
                        s = 0;
                    }

                    if (bcOpenIndexes.indexOf(i) > -1 && d == 0 && s == 0 && bc == 0) {
                        finaltext += full.substring(record, i);
                        i += RemCom.bcopen.length - 1;
                        bc = 1;
                    } else if (RemCom.bcclose != '' && bcCloseIndexes.indexOf(i) > -1 && bc == 1) {
                        record = i + RemCom.bcclose.length;
                        i += RemCom.bcclose.length - 1;
                        bc = 0;
                    } else if (i == full.length - 1 && bc == 0) {
                        finaltext += full.substring(record);
                    }
                }
            } else {
                finaltext = full;
            }

            if (RemCom.comcheck && RemCom.comment != '') {
                var lines = finaltext.split('\n');

                angular.forEach(lines, function(line) {
                    var rem = line;
                    if (RemCom.esc == '') RemCom.esc = null;

                    if (line.includes(RemCom.comment)) {
                        var comIndexes = [],
                            a = -1;
                        while ((a = line.indexOf(RemCom.comment, a + 1)) != -1) {
                            comIndexes.push(a);
                        }

                        var d = 0,
                            s = 0;
                        for (var i = 0; i < line.length; i++) {
                            if (line[i] == '"' && (!RemCom.esccheck || RemCom.esc == '' || line.substring(i - RemCom.esc.length, i) != RemCom.esc || (line.substring(i - RemCom.esc.length, i) == RemCom.esc && line.substring(i - 2 * RemCom.esc.length, i - RemCom.esc.length) == RemCom.esc)) && d == 0 && s == 0) {
                                d++;
                            } else if (line[i] == '"' && (!RemCom.esccheck || RemCom.esc == '' || line.substring(i - RemCom.esc.length, i) != RemCom.esc || (line.substring(i - RemCom.esc.length, i) == RemCom.esc && line.substring(i - 2 * RemCom.esc.length, i - RemCom.esc.length) == RemCom.esc)) && d == 1 && s == 0) {
                                d--;
                            }
                            if (line[i] == "'" && (!RemCom.esccheck || RemCom.esc == '' || line.substring(i - RemCom.esc.length, i) != RemCom.esc || (line.substring(i - RemCom.esc.length, i) == RemCom.esc && line.substring(i - 2 * RemCom.esc.length, i - RemCom.esc.length) == RemCom.esc)) && d == 0 && s == 0) {
                                s++;
                            } else if (line[i] == "'" && (!RemCom.esccheck || RemCom.esc == '' || line.substring(i - RemCom.esc.length, i) != RemCom.esc || (line.substring(i - RemCom.esc.length, i) == RemCom.esc && line.substring(i - 2 * RemCom.esc.length, i - RemCom.esc.length) == RemCom.esc)) && d == 0 && s == 1) {
                                s--;
                            }

                            if (comIndexes.indexOf(i) > -1 && d == 0 && s == 0) {
                                rem = line.substring(0, i);
                                break;
                            }
                        }
                    }
                    if (!rem.replace(/\s/g, '').length) {
                        rem = '\n';
                    }
                    RemCom.arr.push(rem);
                });

                finaltext = RemCom.arr.join('\n');
            }

            while (finaltext.includes('\n\n\n')) {
                finaltext = finaltext.replace('\n\n\n', '\n\n');
            }
            while (finaltext[0] == '\n') {
                finaltext = finaltext.slice(1);
            }

            RemCom.appText = '';
            RemCom.arr = [];
            RemCom.appText = finaltext;
        };
    });
