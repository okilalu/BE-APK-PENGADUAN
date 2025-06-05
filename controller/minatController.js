const { pengaduan, minat } = require("../models");

module.exports = {
  async tambahMinat(req, res) {
    try {
      const user_id = req.user.id;
      const { pelatihan } = req.body;
      const { id } = req.params;
      const getPengaduan = await pengaduan.findByPk(id);
      const createMinat = await minat.create({
        userId: user_id,
        pelatihan,
        pengaduanId: getPengaduan.id,
      });
      return res.status(200).send({
        status: true,
        message: "Berhasil membuat minat",
        data: { minat: createMinat },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: false,
        message: "Gagal membuat minat",
        data: { minat: null },
      });
    }
  },
  async listMinat(req, res) {
    try {
      const getInterest = await minat.findAll();
      if (!getInterest) {
        return res.status(400).send({
          status: false,
          message: "Gagal mendapatkan list minat",
          data: { minat: null },
        });
      }
      return res.status(200).send({
        status: true,
        message: "List minat user",
        data: { minat: getInterest },
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { minat: null },
      });
    }
  },
  async hashUserInterest(req, res) {
    try {
      const { complaintId } = req.params;
      const getInterest = await minat.findOne({
        where: {
          pengaduanId: complaintId,
        },
      });
      if (!getInterest) {
        return res.status(400).send({
          status: false,
          message: "Gagal mendapatkan list minat",
          data: { minat: null },
        });
      }
      return res.status(200).send({
        status: true,
        message: "List minat user",
        data: { minat: getInterest },
      });
    } catch (error) {
      console.log(error);

      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { minat: null },
      });
    }
  },
};
