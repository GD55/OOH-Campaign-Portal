module.exports = function (app, passport, con, upload) {
    // =====================================
    // api =================================
    // =====================================

    //download files
    // app.get('/download/:address', notDesiger, function (req, res) {
    //     res.download(req.params.address);
    // });

    fs = require('fs');
    var xlsx = require('xlsx');
    var excel = require('exceljs');

    // get clients of a brand
    app.get('/api/brands/:client_id', isAdmin, function (req, res) {
        var sql = "SELECT * FROM `brands` WHERE client_id =?";
        con.query(sql, [req.params.client_id], function (err, result, fields) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    });

    // get assignment data for a project
    // app.get('/api/assignment/:project_id', isLoggedIn, function (req, res) {
    //     var sql = "SELECT * FROM `assignment` WHERE project_id = ?";
    //     con.query(sql, [req.params.project_id], function (err, result, fields) {
    //         if (err) {
    //             res.send(err);
    //         } else {
    //             res.json(result);
    //         }
    //     });
    // });

    // update campaign
    app.put('/api/campaign/:project_id', isLoggedIn, function (req, res) {
        var field = req.body.field;
        var value = req.body.value;
        var sql = "UPDATE `projects` SET `" + field + "`='" + value + "' WHERE id =?";
        // var sql = "UPDATE `projects` SET `?`=? WHERE id =?";
        con.query(sql, [req.params.project_id], function (err, result, fields) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    });


    // assign vendor to campaign
    app.get('/api/assign/:vendor_id/:project_id', isAdmin, function (req, res) {
        var sql = "INSERT INTO `assignment`(`project_id`, `vendor_id`) VALUES (?,?)"
        con.query(sql, [req.params.project_id, req.params.vendor_id], function (err, result, fields) {
            if (err) {
                res.send(err);
            } else {
                console.log(result);
                res.json(result);
            }
        });
    });

    // update assignment
    app.put('/api/assignment/:assignment_id', isLoggedIn, function (req, res) {
        var field = req.body.field;
        var value = req.body.value;
        var sql = "UPDATE `assignment` SET `" + field + "`='" + value + "' WHERE id =?";
        // var sql = "UPDATE `projects` SET `?`=? WHERE id =?";
        con.query(sql, [req.params.assignment_id], function (err, result, fields) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    });

    // search vendors by city
    app.get('/api/vendor/city/:search', notDesiger, function (req, res) {
        var sql = "SELECT * FROM `vendors` WHERE ocity LIKE '%" + req.params.search + "%'";
        con.query(sql, function (err, result, fields) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    });

    // search vendors by id
    app.get('/api/vendor/id/:search', notDesiger, function (req, res) {
        var sql = "SELECT * FROM `vendors` WHERE id =" + req.params.search;
        con.query(sql, function (err, result, fields) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    });

    // search vendors by vendorName
    app.get('/api/vendor/vendorName/:search', notDesiger, function (req, res) {
        var sql = "SELECT * FROM `vendors` WHERE vendorName LIKE '%" + req.params.search + "%'";
        con.query(sql, function (err, result, fields) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    });

    // update vendor
    app.put('/api/vendor/:vendor_id', notDesiger, function (req, res) {
        var field = req.body.field;
        var value = req.body.value;
        var sql = "UPDATE `vendors` SET `" + field + "`='" + value + "' WHERE id =?";
        // var sql = "UPDATE `projects` SET `?`=? WHERE id =?";
        con.query(sql, [req.params.vendor_id], function (err, result, fields) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    });

    // rename file in vendor data and uploads folder
    app.put('/api/renameFile/:vendorId', notDesiger, function (req, res) {
        var field = req.body.field;
        var value = Date.now() + '-' + req.body.value;
        var vendorId = req.params.vendorId;
        var sql = "SELECT " + field + " FROM `vendors` WHERE id =?"
        // query to get old name from database
        con.query(sql, [req.params.vendorId], function (err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                var oldPath = result[0][field];
                var newPath = "uploads/" + value;
                console.log(oldPath);
                console.log(vendorId);
                console.log(field);
                console.log(newPath);
                // rename the file in uploads folder
                fs.rename(oldPath, newPath, (err) => {
                    if (err) throw err;
                    console.log('Rename complete!');
                    // function updates the name of file in database
                    updateVendor(field, value, vendorId);
                });
            }
        });
    });

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    // home Page
    app.get('/', isLoggedIn, function (req, res) {
        res.render('index', {
            currentUser: req.user,
            message: req.flash('indexMessage')
        }); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================

    // show the login form
    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login', {
            currentUser: req.user,
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }),
        function (req, res) {
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });

    // =====================================
    // SIGNUP ==============================
    // =====================================

    // show the signup form
    app.get('/signup', isAdmin, function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup', {
            currentUser: req.user,
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', isAdmin, passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)

    // show profile page
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile', {
            currentUser: req.user, // get the user out of session and pass to template
            message: req.flash('profileMessage')
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================

    // log the user out
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });

    // =====================================
    // USER DELETE =========================
    // =====================================

    // show all user for deletion
    app.get('/deleteUser', isAdmin, function (req, res) {
        var sql = "SELECT * FROM `user`";
        con.query(sql, function (err, result, fields) {
            res.render('./deleteUser', {
                currentUser: req.user,
                users: result
            });
        });
    });

    // delete a user
    app.delete("/deleteUser/:id", isAdmin, function (req, res) {
        var sql = "DELETE FROM `user` WHERE id = ?";
        con.query(sql, [req.params.id], function (err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
        res.redirect('/deleteUser');
    });

    // =====================================
    // CAMPAIGN TRACKER ====================
    // =====================================

    // show campaign tracker page
    app.get('/campaign', isLoggedIn, function (req, res) {
        var sql = "SELECT * FROM `user`";
        var sql2 = "SELECT * FROM `clients`";
        var showCampaignQuery = "SELECT projects.*,clients.name AS clientName,brands.brand AS brandName FROM `projects` JOIN clients ON client_id = clients.id JOIN brands ON brand_id = brands.id Order BY Completed='Incomplete' DESC,Completed='On Hold' DESC";
        con.query(showCampaignQuery, function (err, campaigns) {
            con.query(sql, function (err, users) {
                con.query(sql2, function (err, clients) {
                    var sql3 = "SELECT `id`, `vendorName` FROM `vendors` ORDER BY vendorName";
                    con.query(sql3, function (err, vendors) {
                        var sql4 = "SELECT assignment.*,vendors.vendorName AS vendorName FROM `assignment` JOIN vendors ON vendor_id = vendors.id ";
                        con.query(sql4, function (err, assignments) {
                            let frequencyCounter = {};
                            let max = 0;
                            assignments.forEach(element => {
                                var val = element.project_id;
                                frequencyCounter[val] = (frequencyCounter[val] || 0) + 1;
                            });
                            for (let key in frequencyCounter) {
                                if (frequencyCounter[key] > max) {
                                    max = frequencyCounter[key];
                                }
                            }
                            res.render('campaign', {
                                currentUser: req.user, // get the user out of session and pass to template
                                campaigns: campaigns,
                                users: users,
                                clients: clients,
                                vendors: vendors,
                                assignments: assignments,
                                max: max
                            });
                        });
                    });
                });
            });
        });
    });

    // show new campaign page
    app.get('/campaign/new', isAdmin, function (req, res) {
        var sql = "SELECT * FROM `user`";
        var sql2 = "SELECT * FROM `clients`";
        con.query(sql, function (err, users, fields) {
            con.query(sql2, function (err, clients, fields) {
                res.render('newCampaign', {
                    currentUser: req.user,
                    users: users,
                    clients: clients
                });
            });
        });
    });

    // create a new campaign
    app.post('/campaign', isAdmin, function (req, res) {
        if (req.body.assignedTo) {
            var clientId = req.body.clients;
            var brandId = req.body.brands || "";
            if (req.body.clients == "new") {
                // create new client and get insert id
                var insertClientQuery = "INSERT INTO `clients`(`name`) VALUES (?)"
                con.query(insertClientQuery, [req.body.new_client], function (err, result, fields) {
                    clientId = result.insertId;
                    // create new brand from that id and get insert id
                    var insertBrandQuery = "INSERT INTO `brands`(`brand`, `client_id`) VALUES (?,?)"
                    con.query(insertBrandQuery, [req.body.new_brand, clientId], function (err, result, fields) {
                        brandId = result.insertId;
                        var insertCampaignQuery = "INSERT INTO `projects`(`projectHandler`, `month`, `year`, `client_id`, `brand_id`, `mediaFormat`, `units`, `mediaType`, `city`, `duration`, `startDate`, `endDate`, `extension`, `assignedTo`, `Completed`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        con.query(insertCampaignQuery, [req.body.projectHandler, req.body.month, req.body.year, clientId, brandId, req.body.mediaFormat, req.body.units, req.body.mediaType, req.body.city, req.body.duration, req.body.startDate, req.body.endDate, req.body.extension, req.body.assignedTo, req.body.completed], function (err, result, fields) {
                            res.redirect("/campaign");
                        });
                    });
                });
            } else if (req.body.brands == "new") {
                // create new brand for client id and get insert id
                var insertBrandQuery = "INSERT INTO `brands`(`brand`, `client_id`) VALUES (?,?)"
                con.query(insertBrandQuery, [req.body.new_brand, clientId], function (err, result, fields) {
                    brandId = result.insertId;
                    var insertCampaignQuery = "INSERT INTO `projects`(`projectHandler`, `month`, `year`, `client_id`, `brand_id`, `mediaFormat`, `units`, `mediaType`, `city`, `duration`, `startDate`, `endDate`, `extension`, `assignedTo`, `Completed`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    con.query(insertCampaignQuery, [req.body.projectHandler, req.body.month, req.body.year, clientId, brandId, req.body.mediaFormat, req.body.units, req.body.mediaType, req.body.city, req.body.duration, req.body.startDate, req.body.endDate, req.body.extension, req.body.assignedTo, req.body.completed], function (err, result, fields) {
                        res.redirect("/campaign");
                    });
                });
            } else {
                var insertCampaignQuery = "INSERT INTO `projects`(`projectHandler`, `month`, `year`, `client_id`, `brand_id`, `mediaFormat`, `units`, `mediaType`, `city`, `duration`, `startDate`, `endDate`, `extension`, `assignedTo`, `Completed`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                con.query(insertCampaignQuery, [req.body.projectHandler, req.body.month, req.body.year, clientId, brandId, req.body.mediaFormat, req.body.units, req.body.mediaType, req.body.city, req.body.duration, req.body.startDate, req.body.endDate, req.body.extension, req.body.assignedTo, req.body.completed], function (err, result, fields) {
                    res.redirect("/campaign");
                });
            }
        }
    });

    // delete campiagn
    app.delete('/campaign/:project_id', isAdmin, function (req, res) {
        var sql = "DELETE FROM `projects` WHERE `projects`.`id` = ?";
        con.query(sql, [req.params.project_id], function (err, result, fields) {
            if (err) {
                res.send(err);
            } else {
                var sql2 = "DELETE FROM `assignment` WHERE `assignment`.`project_id` = ?";
                con.query(sql2, [req.params.project_id], function (err, result, fields) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.redirect("/campaign");
                    }
                });
            }
        });
    });

    // =====================================
    // Ven-net =============================
    // =====================================

    // show vendor search page
    app.get('/venNet', notDesiger, function (req, res) {
        res.render('vendors', {
            currentUser: req.user,
        });
    });

    // show new vendor page
    app.get('/venNet/new', function (req, res) {
        res.render('newVendor', {
            currentUser: req.user,
        });
    });

    // show new vendor page
    app.get('/venNet/upload', notDesiger, function (req, res) {
        res.render('uploadVendor', {
            currentUser: req.user,
        });
    });

    // download all vendors
    app.get('/venNet/download', isAdmin, function (req, res) {
        con.query("SELECT * FROM `vendors`", function (err, vendors, fields) {
            const jsonvendors = JSON.parse(JSON.stringify(vendors));
            console.log(jsonvendors);
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Vendors'); //creating worksheet

            //  WorkSheet Header
            worksheet.columns = [
                { header: 'id', key: 'id', width: 5 },
                { header: 'organizationType', key: 'organizationType', width: 30 },
                { header: 'vendorName', key: 'vendorName', width: 30 },
                { header: 'officeAddress', key: 'officeAddress', width: 100 },
                { header: 'ocity', key: 'ocity', width: 30 },
                { header: 'opinCode', key: 'opinCode', width: 30 },
                { header: 'ostate', key: 'ostate', width: 30 },
                { header: 'registeredAddress', key: 'registeredAddress', width: 30 },
                { header: 'rcity', key: 'rcity', width: 30 },
                { header: 'rpinCode', key: 'rpinCode', width: 30 },
                { header: 'rstate', key: 'rstate', width: 30 },
                { header: 'website', key: 'website', width: 30 },
                { header: 'materialDescription', key: 'materialDescription', width: 30 },
                { header: 'serviceDescription', key: 'serviceDescription', width: 30 },
                { header: 'contactPersonName', key: 'contactPersonName', width: 30 },
                { header: 'mobileNo', key: 'mobileNo', width: 30 },
                { header: 'landlineNo', key: 'landlineNo', width: 30 },
                { header: 'faxNo', key: 'faxNo', width: 30 },
                { header: 'emailId', key: 'emailId', width: 30 },
                { header: 'bankName', key: 'bankName', width: 30 },
                { header: 'nameOfBank', key: 'nameOfBank', width: 30 },
                { header: 'bankBranch', key: 'bankBranch', width: 30 },
                { header: 'accountNumber', key: 'accountNumber', width: 30 },
                { header: 'ifscCode', key: 'ifscCode', width: 30 },
                { header: 'gstPercentage', key: 'gstPercentage', width: 30 },
                { header: 'tdsPercentage', key: 'tdsPercentage', width: 30 },
                { header: 'gstNo', key: 'gstNo', width: 30 },
                { header: 'stateCode', key: 'stateCode', width: 30 },
                { header: 'hsnCode', key: 'hsnCode', width: 30 },
                { header: 'panNo', key: 'panNo', width: 30 },
                { header: 'msmed', key: 'msmed', width: 30 },
                { header: 'personName', key: 'personName', width: 30 },
                { header: 'designation', key: 'designation', width: 30 }
            ];

            // Add Array Rows
            worksheet.addRows(jsonvendors);

            // Write to File
            workbook.xlsx.writeFile("./uploads/vendors.xlsx")
                .then(function () {
                    console.log("file saved!");
                    res.redirect('/uploads/vendors.xlsx');
                });
        });
    });

    // upload multiple accounts extra files
    var cpUpload2 = upload.fields([{ name: 'uploaded', maxCount: 10 }])
    app.post('/venNet/upload', notDesiger, cpUpload2, function (req, res) {
        if (req.files['uploaded']) {
            console.log(req.body);
            for (var i = 0; i < req.files['uploaded'].length; i++) {
                var fileName = req.files['uploaded'][i].filename;
                console.log("file Uplaoded" + fileName);
                var filePath = './uploads/' + fileName;
                var workbook = xlsx.readFile(filePath);
                var workSheet = workbook.Sheets[workbook.SheetNames[0]];
                console.log(workSheet.C14.v);
                var address = undefined(workSheet.C19) + undefined(workSheet.C20);
                console.log(address);
                console.log(address.length);
                var no = undefined(workSheet.C33);
                console.log(no);
                var insertVendorQuery = "INSERT INTO `vendors`(`organizationType`, `vendorName`, `officeAddress`, `ocity`, `opinCode`, `ostate`, `registeredAddress`, `rcity`, `rpinCode`, `rstate`, `website`, `materialDescription`, `serviceDescription`, `contactPersonName`, `mobileNo`, `landlineNo`, `faxNo`, `emailId`, `bankName`, `nameOfBank`, `bankBranch`, `accountNumber`, `ifscCode`, `gstPercentage`, `tdsPercentage`, `gstNo`, `stateCode`, `hsnCode`, `panNo`, `msmed`, `personName`, `designation`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                con.query(insertVendorQuery, [undefined(workSheet.C14), undefined(workSheet.C16), address, undefined(workSheet.C21), undefined(workSheet.C22), undefined(workSheet.C23), address, undefined(workSheet.C21), undefined(workSheet.C22), undefined(workSheet.C23), undefined(workSheet.C24), undefined(workSheet.C26), undefined(workSheet.C28), undefined(workSheet.C31), undefined(workSheet.C32), undefined(workSheet.C33), undefined(workSheet.C34), undefined(workSheet.C35), undefined(workSheet.C38), undefined(workSheet.C39), undefined(workSheet.C40), undefined(workSheet.C41), undefined(workSheet.C42), undefined(workSheet.C46), undefined(workSheet.C47), undefined(workSheet.C50), undefined(workSheet.C51), undefined(workSheet.C52), undefined(workSheet.C53), undefined(workSheet.C54), undefined(workSheet.C62), undefined(workSheet.C63)], function (err, result, fields) {
                    if (err) {
                        console.log(err);
                    } else {
                    }
                });
                function undefined(a) {
                    if (typeof a === "undefined") {
                        return null;
                    }
                    else {
                        return a.v;
                    }
                }
                fs.unlink(filePath, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("File was deleted");
                    }
                });
            }
        }
        res.redirect('back');
    });

    // create a new vendor
    var cpUpload = upload.fields([{ name: 'cancelledCheque', maxCount: 1 }, { name: 'vendorRoundStamp', maxCount: 1 }, { name: 'accountsFiles', maxCount: 10 }])
    app.post('/venNet', cpUpload, function (req, res) {
        var ServiceType;
        if (req.body.serviceDescription == "Others") {
            ServiceType = req.body.other;
        } else {
            ServiceType = req.body.serviceDescription;
        }
        var insertVendorQuery = "INSERT INTO `vendors`(`organizationType`, `vendorName`, `officeAddress`, `ocity`, `opinCode`, `ostate`, `registeredAddress`, `rcity`, `rpinCode`, `rstate`, `website`, `materialDescription`, `serviceDescription`, `contactPersonName`, `mobileNo`, `landlineNo`, `faxNo`, `emailId`, `bankName`, `nameOfBank`, `bankBranch`, `accountNumber`, `ifscCode`, `gstPercentage`, `tdsPercentage`, `gstNo`, `stateCode`, `hsnCode`, `panNo`, `msmed`, `personName`, `designation`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        con.query(insertVendorQuery, [undefined(req.body.organizationType), undefined(req.body.vendorName), undefined(req.body.officeAddress), undefined(req.body.ocity), undefined(req.body.opinCode), undefined(req.body.ostate), undefined(req.body.registeredAddress), undefined(req.body.rcity), undefined(req.body.rpinCode), undefined(req.body.rstate), undefined(req.body.website), undefined(req.body.materialDescription), undefined(ServiceType), undefined(req.body.contactPersonName), undefined(req.body.mobileNo), undefined(req.body.landlineNo), undefined(req.body.faxNo), undefined(req.body.emailId), undefined(req.body.bankName), undefined(req.body.nameOfBank), undefined(req.body.bankBranch), undefined(req.body.accountNumber), undefined(req.body.ifscCode), undefined(req.body.gstPercentage), undefined(req.body.tdsPercentage), undefined(req.body.gstNo), undefined(req.body.stateCode), undefined(req.body.hsnCode), undefined(req.body.panNo), undefined(req.body.msmed), undefined(req.body.personName), undefined(req.body.designation)], function (err, result, fields) {
            var vendorId = result.insertId;
            var noofmedia = req.body.noofmedia;
            console.log(noofmedia);
            for (var i = 0; i <= noofmedia; i++) {
                console.log(req.body['mediaoption' + i]);
                var insertMediaQuery = "INSERT INTO `media`(`mediaoption`, `city`, `contactperson`, `contactdetail`, `vendorid`) VALUES (?,?,?,?,?)"
                if (req.body['mediaoption' + i]) {
                    con.query(insertMediaQuery, [undefined(req.body['mediaoption' + i]), undefined(req.body['city' + i]), undefined(req.body['contactperson' + i]), undefined(req.body['contactdetail' + i]), vendorId], function (err, result, fields) {
                    });
                }
            }
            if (req.files['cancelledCheque']) {
                var field = 'cancelledCheque';
                var value = req.files['cancelledCheque'][0].filename;
                updateVendor(field, value, vendorId);
            }
            if (req.files['vendorRoundStamp']) {
                var field = 'vendorRoundStamp';
                var value = req.files['vendorRoundStamp'][0].filename;
                updateVendor(field, value, vendorId);
            }
            if (req.files['accountsFiles']) {
                for (var i = 0; i < req.files['accountsFiles'].length; i++) {
                    var field = 'accountExtra' + i;
                    var value = req.files['accountsFiles'][i].filename;
                    updateVendor(field, value, vendorId);
                }
            }
            res.redirect('/venNet');
        });
        function undefined(a) {
            if (typeof a === "undefined") {
                return null;
            }
            else {
                return a;
            }
        }
    });

    // upload multiple accounts extra files
    var cpUpload2 = upload.fields([{ name: 'accountsFiles', maxCount: 10 }])
    app.post('/venNet/uploadAllExtra/:vendorId', notDesiger, cpUpload2, function (req, res) {
        vendorId = req.params.vendorId;
        if (req.files['accountsFiles']) {
            console.log(req.body);
            for (var i = 0; i < req.files['accountsFiles'].length; i++) {
                var field = 'accountExtra' + i;
                var value = req.files['accountsFiles'][i].filename;
                updateVendor(field, value, vendorId);
            }
        }
        res.redirect('back');
    });

    // upload single account file
    var cpUpload3 = upload.fields([
        { name: 'cancelledCheque', maxCount: 1 },
        { name: 'vendorRoundStamp', maxCount: 1 },
        { name: 'accountExtra0', maxCount: 1 },
        { name: 'accountExtra1', maxCount: 1 },
        { name: 'accountExtra2', maxCount: 1 },
        { name: 'accountExtra3', maxCount: 1 },
        { name: 'accountExtra4', maxCount: 1 },
        { name: 'accountExtra5', maxCount: 1 },
        { name: 'accountExtra6', maxCount: 1 },
        { name: 'accountExtra7', maxCount: 1 },
        { name: 'accountExtra8', maxCount: 1 },
        { name: 'accountExtra9', maxCount: 1 }])
    app.post('/venNet/uploadSingle/:vendorId/:fileName', notDesiger, cpUpload3, function (req, res) {
        var vendorId = req.params.vendorId;
        var field = req.params.fileName;
        var value = req.files[field][0].filename;
        var sql = "SELECT " + field + " FROM `vendors` WHERE id =?"
        con.query(sql, [req.params.vendorId], function (err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                var filePath = result[0][field];
                if (filePath) {
                    fs.unlink(filePath, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("File was deleted");
                        }
                    });
                }
            }
        });
        updateVendor(field, value, vendorId);
        res.redirect('back');
    });

    // show a vendor
    app.get('/venNet/show/:id', notDesiger, function (req, res) {
        var sql = "SELECT * FROM `vendors` WHERE id =?";
        con.query(sql, [req.params.id], function (err, result, fields) {
            res.render('./vendor', {
                currentUser: req.user,
                vendor: result[0]
            });
        });
    });


    // delete account file in vendor data and delete from uploads folder
    app.get('/venNet/removeFile/:vendorId/:field', notDesiger, function (req, res) {
        var field = req.params.field;
        var sql = "SELECT " + field + " FROM `vendors` WHERE id =?"
        // query to get address of file
        con.query(sql, [req.params.vendorId], function (err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                var filePath = result[0][field];
                var sql = "UPDATE `vendors` SET `" + field + "`= NULL WHERE id =?";
                // query to emply the field in database
                con.query(sql, [req.params.vendorId], function (err, result, fields) {
                    if (err) {
                        res.send(err);
                    } else {
                        // delete file from Uploads
                        fs.unlink(filePath, function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("File was deleted");
                            }
                        });
                        res.redirect('back');
                    }
                });
            }
        });
    });

    // update a vendor
    function updateVendor(field, value, vendorId) {
        var sql = "UPDATE `vendors` SET `" + field + "`='uploads/" + value + "' WHERE id =?";
        con.query(sql, vendorId, function (err, result, fields) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(result);
                return;
            }
        });
    }



    // =====================================
    // office-tools ========================
    // =====================================

    // show excel tool
    app.get('/tools/excel', notDesiger, function (req, res) {
        var sql = "SELECT * FROM `ppt`";
        con.query(sql, function (err, pptFiles) {
            if (err) {
                console.log(err);
            } else {
                var sql = "SELECT * FROM `excel`";
                con.query(sql, function (err, files) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('./excelTool', {
                            currentUser: req.user,
                            files: files,
                            pptFiles: pptFiles
                        });
                    }
                });
            }
        });
    });

    // show ppt tool
    app.get('/tools/ppt', notDesiger, function (req, res) {
        var sql = "SELECT * FROM `excel`";
        con.query(sql, function (err, excelFiles) {
            if (err) {
                console.log(err);
            } else {
                var sql = "SELECT * FROM `ppt`";
                con.query(sql, function (err, files) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('./pptTool', {
                            currentUser: req.user,
                            files: files,
                            excelFiles: excelFiles
                        });
                    }
                });
            }
        });
    });

    // copy file from source to destination
    app.get('/api/copy/:source/:destination', notDesiger, function (req, res) {
        var source = "public/templates/" + req.params.source;
        var destination = "uploads/" + req.params.destination;
        fs.copyFile(source, destination, (err) => {
            if (err) throw err;
            console.log(source + ' was copied to ' + destination);
            return;
        });
    });

    // upload all files
    supload = upload.array('sourceFiles', 12);
    app.post('/api/upload/:type', notDesiger, function (req, res) {
        var type = req.params.type;
        files = []
        supload(req, res, function (err) {
            if (err) {
                return res.end("Error uploading file.");
            }
            for (var i = 0; i < req.files.length; i++) {
                var value = req.files[i].filename;
                var sql = "INSERT INTO `" + type + "`(`name`) VALUES (?)";
                a = 0;
                con.query(sql, value, function (err, file) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        a = a + 1;
                        files[a - 1] = file.insertId;
                        if (a == req.files.length) {
                            min = Math.min(...files);
                            f = [];
                            for (var i = 0; i < req.files.length; i++) {
                                s = [];
                                s[0] = min + i;
                                s[1] = req.files[i].filename;
                                f[i] = s;
                            }
                            res.json(f);
                        }
                    }
                });
            }
        });
    });

    app.delete('/api/deleteSource', notDesiger, function (req, res) {
        var value = req.body.name;
        var type = req.body.type;
        deletefile(type, value);
        return;
    });

    app.delete('/api/deleteAll', notDesiger, function (req, res) {
        var type = req.body.type;
        var sql = "SELECT * FROM `" + type + "` WHERE source = 1";
        con.query(sql, function (err, files) {
            if (err) {
                console.log(err);
            } else {
                files.forEach(function (file, i) {
                    deletefile(type, file.name);
                });
                return;
            }
        });
    });

    app.delete('/api/cleanTable', notDesiger, function (req, res) {
        var type = req.body.type;
        var sql = "SELECT * FROM `" + type + "`";
        con.query(sql, function (err, files) {
            if (err) {
                console.log(err);
                return;
            } else {
                files.forEach(function (file, i) {
                    deletefile(type, file.name);
                });
                var sql = "TRUNCATE TABLE `" + type + "`";
                con.query(sql, function (err, ) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        console.log("table truncated");
                        return;
                    }
                });
            }
        });
    });

    function deletefile(table, name) {
        var sql = "DELETE FROM `" + table + "` WHERE name =?";
        var filePath = "uploads/" + name;
        con.query(sql, name, function (err, files) {
            if (err) {
                console.log(err);
                return;
            } else {
                fs.unlink(filePath, function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        console.log("File was deleted");
                        return;
                    }
                });
            }
        });
    }

    app.post('/api/pyhton', notDesiger, function (req, res) {
        dest = req.body.destination;
        type = req.body.type;
        if (type == "ppt") {
            template = "pptTemplate.pptx";
            path = "python/pptScript.py";
        } else {
            template = req.body.template;
            path = "python/script.py";
        }
        var sql = "SELECT * FROM `" + type + "` WHERE source = 1";
        con.query(sql, function (err, files) {
            if (err) {
                console.log(err);
                return;
            } else {
                const spawn = require("child_process").spawn;
                var toBeSent = [];
                files.forEach(function (file, i) {
                    toBeSent[i] = file.name;
                });
                const pyhtonProcess = spawn('python', [path, toBeSent, dest, template]);
                // get okay or not okay status from python
                // get errors from script about non ideal elements
                pyhtonProcess.stdout.on('data', function (data) {
                    console.log(data.toString());
                });
                var sql = "INSERT INTO `" + type + "`(`name`,`source`) VALUES (?,0)";
                con.query(sql, dest, function (err, file) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        res.json(file);
                    }
                });
                // delete the files in the table and truncate the excel table
            }
        });
    });

};



// =====================================
// MIDDLEWARE ==========================
// =====================================

// route middleware to make sure user in logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('loginMessage', 'You need to log in first');
        // if they aren't redirect them to the home page
        res.redirect('/login');
    }
}

// route middleware to make sure user is admin
function isAdmin(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        // if user logged in is admin
        if (req.user.designation == "admin") {
            return next();
        } else {
            req.flash('indexMessage', 'You need to be a admin.');
            // if they aren't redirect them to the home page
            res.redirect('/');
        }
    } else {
        req.flash('loginMessage', 'You need to log in first');
        // if they aren't redirect them to the home page
        res.redirect('/login');
    }
}

// route middleware to make sure user is admin
function notDesiger(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        // if user logged in is admin
        if (req.user.designation == "admin" || req.user.designation == "accountant" || req.user.designation == "coordinator") {
            return next();
        } else {
            req.flash('indexMessage', 'You dont have enough permission');
            // if they aren't redirect them to the home page
            res.redirect('/');
        }
    } else {
        req.flash('loginMessage', 'You need to log in first');
        // if they aren't redirect them to the home page
        res.redirect('/login');
    }
}