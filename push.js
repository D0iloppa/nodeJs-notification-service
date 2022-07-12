var push = require('web-push');

const vapidKeys = {publicKey: 'BAgxgaPKoay1CNsWUUQCqISp4r_S76ooXjG1Vm-iw6jPU5Ri0oyGHRfuaDr-7sunrDxQ2gLpJFf5-fbsKu3B0T8', privateKey: 'xoZLI3E3elqMGic0nesj0d2rZS6YfXb76qBfSAMk1yU'}


push.setVapidDetails('mailto:kdi3939@gmail.com' , vapidKeys.publicKey , vapidKeys.privateKey);



var sub = {
    "endpoint":"https://fcm.googleapis.com/fcm/send/fE6OkefjruQ:APA91bGnLIdKbkg46SOOHA2Nn59GGCv7UYK-aTknAXnHrVfv9E7oWIDKpAZTeXAPQHSeR3o02wi0Dmjfp1yF1wMtIK4kT5XYJkqa7jslWEA-ZGvvY7dzWHVzyRDKYgWa0vWSBQMUT7Yr",
    "expirationTime":null,
    "keys":{
        "p256dh":"BNnwsgw569hqImDtjelhUDzkY9ootECwtYNVewmc2nyDeEsjLVqUmaICIkBgh6LFK9bJfXHfBiT-tr8-STc_lOY",
        "auth":"kC-ecSF-EMuq8tM_sD9ExA"
    }
};

var sub2 = {"endpoint":"https://fcm.googleapis.com/fcm/send/f-zMsTKZhA8:APA91bGVcoZoZPjOPFNxRNi9Uxmi3J9TU5VJUeLp_YbA3jkSS0iGTi9YpN54g9pSfQDW631xXqmG2nPu6bpAEj7k_UHsue9p_YPwMvQ512J10GzN_9cfiu83JeqxaX3JTUFYFT12Cn6u","expirationTime":null,"keys":{"p256dh":"BD8dVtwvoiPmZd1QnstEye2Pxlu6zzCDLLJfKsgPL7SrE0YOx-yXF7ARmmtWSpmwhLDWSs0rmdY1fyr8GN5HPDw","auth":"6kQ_8WeNy9cDWbfsfYNXvQ"}};

push.sendNotification(sub2,'test message')

/*
.then()
.catch();
*/