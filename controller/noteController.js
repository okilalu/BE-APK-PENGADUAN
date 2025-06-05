const { where } = require("sequelize");
const { pengaduan, note } = require("../models");

module.exports = {
  async tambahNote(req, res) {
    try {
      const { officerName, description } = req.body;
      if (officerName == "") {
        return res.status(403).send({
          status: false,
          message: "Harus diisi",
          data: { notes: null },
        });
      }
      if (description == "") {
        return res.status(403).send({
          status: false,
          message: "Harus diisi",
          data: { notes: null },
        });
      }
      const { id } = req.params;
      const getIdComplaint = await pengaduan.findByPk(id);
      if (!getIdComplaint) {
        return res.status(404).send({
          status: false,
          message: "Pengaduan tidak ditemukan",
          data: { notes: null },
        });
      }
      const createNote = await note.create({
        officerName,
        description,
        pengaduanId: getIdComplaint.id,
      });
      return res.status(200).send({
        status: true,
        message: "Berhasil menambah note",
        data: { notes: createNote },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { notes: null },
      });
    }
  },
  async updateNote(req, res) {
    try {
      const { id } = req.params;
      const { officerName, description } = req.body;
      const getNotes = await note.findByPk(id);
      if (!getNotes) {
        return res.status(404).send({
          status: false,
          message: "Notes tidak ada",
          data: { notes: null },
        });
      }
      const updatedNote = await getNotes.update({
        officerName,
        description,
      });
      return res.status(200).send({
        status: true,
        message: "Berhasil memperbarui notes",
        data: { notes: updatedNote },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { notes: null },
      });
    }
  },
  async deleteNote(req, res) {
    try {
      const { id } = req.params;
      const deleteNote = await note.destroy({ where: { id } });
      if (!deleteNote) {
        return res.status(404).send({
          status: false,
          message: "Notes tidak ditemukan",
          data: { notes: null },
        });
      }
      return res.status(200).send({
        status: true,
        message: "Berhasil menghapus notes",
        data: { notes: deleteNote },
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { notes: null },
      });
    }
  },
  async getAllNote(req, res) {
    try {
      const { id } = req.params;
      const getNote = await note.findAll({
        where: { pengaduanId: id },
      });
      if (getNote.length === 0) {
        return res.status(404).send({
          status: false,
          message: "Pengaduan belum memiliki notes",
          data: { notes: null },
        });
      }
      return res.status(200).send({
        status: true,
        message: "List semua notes",
        data: { notes: getNote },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { notes: null },
      });
    }
  },
};
