const nodeMailer = require("nodemailer");
const { pengaduan, victim, abuser, note } = require("../models");
const { User } = require("../models");
const { ROLES } = require("../lib/const");
const { Op, where } = require("sequelize");
module.exports = {
  async complaintClient(req, res) {
    try {
      const user_id = req.user.id;
      const sendComplaint = await User.findAll({
        where: {
          [Op.or]: [{ role: ROLES.ADMIN }, { role: ROLES.SUPERADMIN }],
        },
      });
      const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: "appcom2024@gmail.com",
          pass: "nkex bofk zujl ajwy",
        },
      });

      const {
        complaintName,
        complaintAddress,
        complaintEducate,
        complaintNumber,
        complaintRelation,
        companionName,
        companionAddress,
        companionEducate,
        companionNumber,
        companionRelation,
        victims,
        caseType,
        caseViolence,
        physical,
        sexual,
        psychology,
        economy,
        chronology,
        abusers,
      } = req.body;
      if (caseViolence == "fisik" && !physical) {
        return res.status(200).send({
          status: true,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      if (caseViolence == "sexual" && !sexual) {
        return res.status(200).send({
          status: true,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      if (caseViolence == "psikologi" && !psychology) {
        return res.status(200).send({
          status: true,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      if (caseViolence == "ekonomi" && !economy) {
        return res.status(200).send({
          status: true,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      const createPengaduan = await pengaduan.create({
        userid: user_id,
        complaintName,
        complaintAddress,
        complaintEducate,
        complaintNumber,
        complaintRelation,
        companionName,
        companionAddress,
        companionEducate,
        companionNumber,
        companionRelation,
        caseType,
        caseViolence,
        physical,
        sexual,
        psychology,
        economy,
        chronology,
        status: "Menunggu konfirmasi",
      });
      if (!createPengaduan) {
        return res.status(400).send({
          status: false,
          message: "Gagal membuat pengaduan",
          data: { complaint: null },
        });
      }
      if (createPengaduan) {
        const emailAddresses = sendComplaint.map((user) => user.email);
        const mailOption = {
          from: "appcom2024@gmail.com",
          to: emailAddresses,
          subject:
            "Laporan Pengaduan dari Mitra : " + createPengaduan.complaintName,
          html:
            "<p>Silahkan lihat lengkap laporan pengaduan " +
            createPengaduan.complaintName +
            ' <a href="https://play.google.com/store/apps/details?id=com.tokopedia.tkpd' +
            '">Link</a> Masuk ke aplikasi</p>',
        };
        for (const vic of victims) {
          await victim.create({
            ...vic,
            pengaduanId: createPengaduan.id,
          });
        }

        for (const abuse of abusers) {
          await abuser.create({
            ...abuse,
            pengaduanId: createPengaduan.id,
          });
        }

        await transporter.sendMail(mailOption);
        return res.status(200).send({
          status: true,
          message: "Berhasil Membuat Pengaduan",
          data: { complaint: createPengaduan },
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },

  async updatePengaduan(req, res) {
    try {
      const user_id = req.user.id;
      const id = req.params.id;
      const getPengaduanById = await pengaduan.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: victim,
            attributes: ["id", "name", "pengaduanId"],
          },
          {
            model: abuser,
            attributes: ["id", "abuserName", "pengaduanId"],
          },
        ],
      });
      if (!getPengaduanById) {
        console.log("getPengaduanById : ", getPengaduanById);

        return res.status(400).send({
          status: false,
          message: "Pengaduan tidak ditemukan",
          data: { complaint: null },
        });
      }

      const {
        complaintName,
        complaintAddress,
        complaintEducate,
        complaintNumber,
        complaintRelation,
        companionName,
        companionAddress,
        companionEducate,
        companionNumber,
        companionRelation,
        victims,
        caseType,
        caseViolence,
        physical,
        sexual,
        psychology,
        economy,
        chronology,
        abusers,
      } = req.body;

      if (caseViolence === "fisik" && !physical) {
        return res.status(401).send({
          status: false,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      if (caseViolence == "sexual" && !sexual) {
        return res.status(402).send({
          status: false,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      if (caseViolence == "psikologi" && !psychology) {
        return res.status(403).send({
          status: false,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      if (caseViolence == "ekonomi" && !economy) {
        return res.status(404).send({
          status: false,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }

      const updatePengaduan = await getPengaduanById.update({
        userid: user_id,
        complaintName,
        complaintAddress,
        complaintEducate,
        complaintNumber,
        complaintRelation,
        companionName,
        companionAddress,
        companionEducate,
        companionNumber,
        companionRelation,
        caseType,
        caseViolence,
        physical,
        sexual,
        psychology,
        economy,
        chronology,
        status: "Menunggu Konfirmasi",
      });
      const updateVictim = [];
      for (const vic of victims) {
        const { victimId, ...victimData } = vic;
        if (victimId) {
          await victim.update(
            { ...victimData },
            {
              where: {
                id: victimId,
                pengaduanId: id,
              },
            }
          );
          updateVictim.push(victimData);
        } else {
          const createVictim = await victim.create({
            ...victimData,
            pengaduanId: id,
          });
          updateVictim.push(createVictim);
        }
      }
      const updateAbuser = [];
      for (const abuse of abusers) {
        const { abuserId, ...abuserData } = abuse;
        if (abuserId) {
          await abuser.update(
            { ...abuserData },
            {
              where: {
                id: abuserId,
                pengaduanId: id,
              },
            }
          );
          updateAbuser.push(abuserData);
        } else {
          const createAbuser = await abuser.create({
            ...abuserData,
            pengaduanId: id,
          });
          updateAbuser.push(createAbuser);
        }
      }
      if (updatePengaduan) {
        return res.status(200).send({
          status: true,
          message: "Update Sukses",
          data: { complaint: updatePengaduan },
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: false,
        message: "Gagal Update Pengaduan",
        data: { complaint: null },
      });
    }
  },

  async deletePengaduan(req, res) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const result = await pengaduan.findOne({
        where: { id, userid: user_id },
        include: [
          {
            model: victim,
            attributes: ["id", "pengaduanId"],
          },
          {
            model: abuser,
            attributes: ["id", "pengaduanId"],
          },
        ],
      });
      if (!result) {
        return res.status(404).send({
          deletedby: req.result,
          message: "Pengaduan Tidak ditemukan",
        });
      }
      await victim.destroy({ where: { pengaduanId: id } });
      await abuser.destroy({ where: { pengaduanId: id } });

      await pengaduan.destroy({ where: { id, userid: user_id } });

      return res.status(200).send({
        status: true,
        message: "Berhasil Menghapus Pengaduan",
        data: { complaint: result },
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },
  async listComplaint(req, res) {
    try {
      const getComplaint = await pengaduan.findAll();
      if (getComplaint) {
        return res.status(200).send({
          status: true,
          massage: "List Pengaduan",
          data: { complaint: getComplaint },
        });
      } else {
        return res.status(401).send({
          status: false,
          massage: "List Pengaduan Tidak ditemukan",
          data: { complaint: null },
        });
      }
    } catch (error) {
      return res.send(500).send({
        status: false,
        massage: "Terjadi Kesalahan pada server",
        data: { complaint: null },
      });
    }
  },
  async getCaseViolence(req, res) {
    try {
      const getComplaint = await pengaduan.findAll();

      const violenceCountArray = [
        { type: "physical", count: 0 },
        { type: "sexual", count: 0 },
        { type: "psychology", count: 0 },
        { type: "economy", count: 0 },
      ];

      getComplaint.forEach((complaint) => {
        if (Array.isArray(complaint.caseViolence)) {
          complaint.caseViolence.forEach((violenceType) => {
            const violence = violenceCountArray.find(
              (v) => v.type === violenceType
            );
            if (violence) {
              violence.count++;
            }
          });
        }
      });

      if (getComplaint.length > 0) {
        return res.status(200).send({
          status: true,
          message: "List Pengaduan berdasarkan jenis kekerasan",
          data: violenceCountArray,
        });
      } else {
        return res.status(404).send({
          status: false,
          message: "No complaints found",
          data: [],
        });
      }
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: "Terjadi Kesalahan pada server",
        data: [],
      });
    }
  },
  async getWaitComplaintByUserId(req, res) {
    try {
      const userId = req.user.id;
      const status = "Menunggu Konfirmasi";
      const role = req.user.role;

      let results;

      if (role === "Admin" || role === "superadmin") {
        results = await pengaduan.findAll({ where: { status: status } });
      } else {
        results = await pengaduan.findAll({
          where: { status: status, userId: userId },
        });
      }

      if (!results) {
        return res.status(404).send({
          status: false,
          message: "Kasus tidak ditemukan",
          data: { complaint: null },
        });
      }
      if (results) {
        return res.status(200).send({
          status: true,
          message: "Berhasil mendapatkan pengaduan",
          data: { complaint: results },
        });
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },
  async getProccessComplaintByUserId(req, res) {
    try {
      const userId = req.user.id;
      const status = "Sedang diproses";
      const role = req.user.role;

      let results;

      if (role === "Admin" || role === "superadmin") {
        results = await pengaduan.findAll({ where: { status: status } });
      } else {
        results = await pengaduan.findAll({
          where: { status: status, userId: userId },
        });
      }

      if (!results) {
        return res.status(404).send({
          status: false,
          message: "Kasus tidak ditemukan",
          data: { complaint: null },
        });
      }
      if (results) {
        return res.status(200).send({
          status: true,
          message: "Berhasil mendapatkan pengaduan",
          data: { complaint: results },
        });
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },
  async getDoneComplaintByUserId(req, res) {
    try {
      const userId = req.user.id;
      const status = "Kasus Telah Selesai";
      const role = req.user.role;

      let results;

      if (role === "Admin" || role === "superadmin") {
        results = await pengaduan.findAll({ where: { status: status } });
      } else {
        results = await pengaduan.findAll({
          where: { status: status, userId: userId },
        });
      }

      if (!results) {
        return res.status(404).send({
          status: false,
          message: "Kasus tidak ditemukan",
          data: { complaint: null },
        });
      }
      if (results) {
        return res.status(200).send({
          status: true,
          message: "Berhasil mendapatkan pengaduan",
          data: { complaint: results },
        });
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },

  async getComplaintbyId(req, res) {
    try {
      const { id } = req.params;
      const getCase = await pengaduan.findOne({
        where: { id: id },
        include: [
          {
            model: victim,
            attributes: [
              "name",
              "born",
              "gender",
              "nik",
              "address",
              "phoneNumber",
              "education",
              "parentName",
              "parentJob",
              "parentAddress",
              "parentNumber",
            ],
          },
          {
            model: abuser,
            attributes: [
              "abuserName",
              "abuserBorn",
              "abuserAddress",
              "abuserEducate",
              "abuserJob",
              "abuserStatus",
              "abuserRelation",
            ],
          },
        ],
      });
      if (!getCase) {
        return res.status(401).send({
          status: false,
          message: "Kasus tidak dapat ditemukan",
          data: { complaint: null },
        });
      }
      return res.status(200).send({
        status: true,
        message: "List Pengaduan berdasarkan id",
        data: { complaint: getCase },
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },
  async getComplaintUpdate(req, res) {
    try {
      const status = "Sedang diproses";
      const getComplaint = await pengaduan.findOne({ where: { status } });

      if (!getComplaint) {
        return res.status(401).send({
          status: false,
          message: "Pengaduan tidak ditemukan",
          data: { complaint: getComplaint },
        });
      }
      return res.status(200).send({
        status: true,
        message: "List Pengaduan",
        data: { complaint: getComplaint },
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { user: null },
      });
    }
  },
  async getComplaintDone(req, res) {
    try {
      const status = "Kasus Telah Selesai";
      const getComplaint = await pengaduan.findOne({ where: { status } });

      if (!getComplaint) {
        return res.status(401).send({
          status: false,
          message: "Pengaduan tidak ditemukan",
          data: { complaint: getComplaint },
        });
      }
      return res.status(200).send({
        status: true,
        message: "List Pengaduan",
        data: { complaint: getComplaint },
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { user: null },
      });
    }
  },
  async createExcel(req, res) {
    try {
      const getAllData = await pengaduan.findAll({
        include: [
          {
            model: victim,
            attributes: [
              "name",
              "born",
              "gender",
              "nik",
              "address",
              "phoneNumber",
              "education",
              "parentName",
              "parentJob",
              "parentAddress",
              "parentNumber",
            ],
          },
          {
            model: abuser,
            attributes: [
              "abuserName",
              "abuserBorn",
              "abuserAddress",
              "abuserEducate",
              "abuserJob",
              "abuserStatus",
              "abuserRelation",
            ],
          },
          {
            model: note,
            attributes: ["officerName", "description"],
          },
        ],
      });
      if (!getAllData) {
        return res.status(400).send({
          status: false,
          message: "Gagal mendapatkan data pengaduan",
          data: { complaint: null },
        });
      }
      return res.status(200).send({
        status: true,
        message: "Berhasil export data ke excel",
        data: { complaint: getAllData },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: false,
        message: "Terjadi Kesalahan Pada Server",
        data: { complaint: null },
      });
    }
  },
};
