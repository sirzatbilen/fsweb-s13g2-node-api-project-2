// post routerları buraya yazın

const express = require("express");
const router = express.Router();
const Post = require("./posts-model");

router.get("/", (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(201).json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: "Gönderiler alınamadı" });
    });
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    });
});

// router.post("/", (req, res) => {
//   const { title, contents } = req.body;
//   if (!title || !contents) {
//     res
//       .status(400)
//       .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
//   } else {
//     Post.insert({ title, contents })
//       .then(({ id }) => {
//         Post.findById(id).then((findedPost) => {
//           res.status(201).json(findedPost);
//         });
//       })
//       .catch((err) => {
//         res
//           .status(500)
//           .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
//       });
//   }
// });

router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
  } else {
    try {
      let { id } = await Post.insert({ title, contents });
      let insertedPost = await Post.findById(id);
      res.status(201).json(insertedPost);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    }
  }
});

router.put("/:id", async (req, res) => {
  let willBeUpdatePost = await Post.findById(req.params.id);
  if (!willBeUpdatePost) {
    res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
  } else {
    let { title, contents } = req.body;
    if (!title || !contents) {
      res
        .status(400)
        .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
    } else {
      try {
        let updatePostId = await Post.update(req.params.id, req.body);
        let updatePost = await Post.findById(updatePostId);
        res.status(200).json(updatePost);
      } catch (error) {
        res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
      }
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let willBeDeletePost = await Post.findById(req.params.id);
    if (!willBeDeletePost) {
      res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
    } else {
      await Post.remove(req.params.id);
      res.status(200).json(willBeDeletePost);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    let existPost = await Post.findById(req.params.id);
    if (!existPost) {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    } else {
      let comments = await Post.findPostComments(req.params.id);
      res.status(200).json(comments);
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
