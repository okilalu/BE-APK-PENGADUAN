const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const middleware = require("./middleware/auth");
const pengaduanController = require("./controller/pengaduanController");
const userController = require("./controller/userController");
const infoController = require("./controller/infoController");
const noteController = require("./controller/noteController");
const minatController = require("./controller/minatController");
const victimController = require("./controller/VictimController");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "BERHASIL",
  });
});

// CRUD Admin
app.post("/admin/register", userController.registerAdmin);
app.post("/admin/login", userController.loginAdmin);
app.put(
  "/admin/update/:id",
  middleware.authenticate,
  userController.updateAdmin
);
app.put(
  "/admin/update/complaint/:id",
  middleware.authenticate,
  middleware.roles,
  userController.adminUpdateComplaint
);
app.put(
  "/admin/done/complaint/:id",
  middleware.authenticate,
  middleware.roles,
  userController.adminComplaintDone
);

// CRUD user
app.post("/register/user", userController.registerUser);
app.post("/login/user", userController.loginUser);
app.put("/update/user/:id", middleware.authenticate, userController.updateUser);
app.delete(
  "/delete/user/:id",
  middleware.authenticate,
  userController.deleteUser
);
app.get("/list/user", userController.listUser);
app.get("/user/:id", userController.getUserById);
app.get("/current/user", middleware.authenticate, userController.currentUser);
app.get(
  "/api/user/chat",
  middleware.authenticate,
  userController.getUserByChat
);

// Complaint form user / CRUD items
app.post(
  "/create",
  middleware.authenticate,
  pengaduanController.complaintClient
);
app.put(
  "/update/:id",
  middleware.authenticate,
  pengaduanController.updatePengaduan
);
app.put("/update/status/:id", pengaduanController.complaintClient);
app.delete(
  "/delete/complaint/:id",
  middleware.authenticate,
  pengaduanController.deletePengaduan
);
app.get("/list/case", pengaduanController.listComplaint);
app.get("/case/violence", pengaduanController.getCaseViolence);
app.get("/case/gender", victimController.getGender);
app.get("/case/education", victimController.getCaseByEducation);
app.get(
  "/case/wait/admin/id",
  middleware.authenticate,
  pengaduanController.getWaitComplaintByUserId
);
app.get(
  "/case/proccess/admin/id",
  middleware.authenticate,
  pengaduanController.getProccessComplaintByUserId
);
app.get(
  "/case/done/admin/id",
  middleware.authenticate,
  pengaduanController.getDoneComplaintByUserId
);
app.get("/case/:id", pengaduanController.getComplaintbyId);
app.get(
  "complaint/update/status",
  middleware.authenticate,
  middleware.roles,
  pengaduanController.getComplaintUpdate
);
app.get(
  "complaint/done/status",
  middleware.authenticate,
  middleware.roles,
  pengaduanController.getComplaintDone
);

// CRUD Informasi
app.post("/create/info", infoController.createInfo);
app.put("/update/info/:id", infoController.updateInfo);
app.delete("/deleted/info/:id", infoController.deleteInfo);
app.get("/list/info", infoController.listInfo);

// CRUD Notes
app.post(
  "/create/notes/:id",
  middleware.authenticate,
  middleware.roles,
  noteController.tambahNote
);
app.put(
  "/update/notes/:id",
  middleware.authenticate,
  middleware.roles,
  noteController.updateNote
);
app.delete(
  "/delete/notes/:id",
  middleware.authenticate,
  middleware.roles,
  noteController.deleteNote
);
app.get("/notes/:id", middleware.authenticate, noteController.getAllNote);

// CRUD Minat
app.post(
  "/create/minat/:id",
  middleware.authenticate,
  minatController.tambahMinat
);
app.get("/minat", middleware.authenticate, minatController.listMinat);
app.get(
  "/minat/:complaintId",
  middleware.authenticate,
  minatController.hashUserInterest
);

// Export Excell
app.get(
  "/export/excel",
  middleware.authenticate,
  middleware.roles,
  pengaduanController.createExcel
);

app.use(express.json());
app.listen(process.env.PORT || 5000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
  console.log(`http://localhost:${this.address().port}`);
});
