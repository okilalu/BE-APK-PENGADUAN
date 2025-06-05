const { Informasi } = require("../models");

module.exports = {
  async createInfo(req, res) {
    try {
      const { title, descriptions } = req.body;
      const createInformasi = await Informasi.create({
        title,
        descriptions,
      });
      if (!createInformasi) {
        return res.status(400).send({
          status: false,
          message: "Gagal membuat informasi",
          data: { informasi: null },
        });
      }
      return res.status(200).send({
        status: true,
        message: "Berhasil membuat informasi",
        data: { informasi: createInformasi },
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { informasi: null },
      });
    }
  },
  async updateInfo(req, res) {
    try {
      const { title, descriptions } = req.body;
      const { id } = req.params;
      const getInfoId = await Informasi.findByPk(id);
      console.log("getInfoId : ", getInfoId);

      if (!getInfoId) {
        return res.status(400).send({
          status: false,
          message: "Informasi tidak ada ",
          data: { informasi: null },
        });
      }
      const updateInformasi = await getInfoId.update({
        title,
        descriptions,
      });
      console.log("updateInformasi : ", updateInformasi);

      return res.status(200).send({
        status: true,
        message: "Berhasil memperbarui informasi",
        data: { informasi: updateInformasi },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { informasi: null },
      });
    }
  },
  async deleteInfo(req, res) {
    try {
      const { id } = req.params;
      const deletedInformasi = await Informasi.destroy({ where: { id } });
      if (!deletedInformasi) {
        return res.status(400).send({
          status: false,
          message: "Gagal menghapus informasi",
          data: { informasi: null },
        });
      }
      return res.status(200).send({
        status: true,
        message: "Berhasil menghapus informasi",
        data: { informasi: deletedInformasi },
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { informasi: null },
      });
    }
  },
  async listInfo(req, res) {
    try {
      const listInformasi = await Informasi.findAll();

      if (listInformasi) {
        return res.status(200).send({
          status: true,
          massage: "List Infromasi",
          data: { informasi: listInformasi },
        });
      } else {
        return res.status(400).send({
          status: true,
          massage: "tidak ada Infromasi",
          data: { informasi: null },
        });
      }
    } catch (error) {
      return res.status(500).send({
        status: false,
        massage: "Terjadi kesalahan pada server",
        data: { informasi: null },
      });
    }
  },
  //
};
