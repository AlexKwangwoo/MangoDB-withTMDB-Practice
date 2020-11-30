const express = require("express");
const router = express.Router();
const { Favorite } = require("../models/Favorite");
//모델에 있는걸 가져오는것이다!
//index.js 에 받아주는 내용이있다!! 주소!!
//app.use("/api/favorite", require("./routes/favorite"));이거!!
//-----------------------------------------------------------------------------
//req는 내가 요청하는것 res는 받은거의 내용을 쓰는것!
// 일단.. post로 요청을 받으면.. req를 통해 프론트앤드의 변수들..movieId등을 받아온다!!
// 그다음.. 변수를 이용해 쿼리를 돌려 실행값을 찾고..
// 그실행값을 json에 포함시켜 res로 보내준다!

router.post("/favoriteNumber", (req, res) => {
  //mongoDB에서   favorite 숫자를 가져오기
  Favorite.find({ movieId: req.body.movieId }).exec((err, info) => {
    //info는 받아온 내용을 넣겠다는거임!
    if (err) return res.status(400).send(err);
    // 그다음에   프론트에  다시   숫자 정보를 보내주기
    // 모델필드에있는 movieId 찾고. exec 쿼리를 돌릴것임!
    res.status(200).json({ success: true, favoriteNumber: info.length });
  });
});

router.post("/favorited", (req, res) => {
  // 내가 이 영화를  Favorite 리스트에 넣었는지   정보를  DB 에서 가져오기
  Favorite.find({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
    //내가 눌렀는지 한번더 체크 해야해서.. userFrom 넣어야함!
  }).exec((err, info) => {
    if (err) return res.status(400).send(err);
    // 그다음에   프론트에  다시   숫자 정보를 보내주기
    //즉 두가지 걸러서 한개라도 있으면 좋아요 눌렀다는 뜻임

    let result = false;
    if (info.length !== 0) {
      result = true;
    }

    res.status(200).json({ success: true, favorited: result });
  });
});

router.post("/removeFromFavorite", (req, res) => {
  Favorite.findOneAndDelete({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, doc });
  });
});

router.post("/addToFavorite", (req, res) => {
  console.log("추가");
  console.log(req.body);
  const favorite = new Favorite(req.body);

  favorite.save((err, doc) => {
    //저장매소드
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true });
  });
});

router.post("/getFavoredMovie", (req, res) => {
  Favorite.find({ userFrom: req.body.userFrom }).exec((err, favorites) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, favorites });
  });
});

router.post("/removeFromFavorite", (req, res) => {
  Favorite.findOneAndDelete({
    //지우는 매쏘드!!
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true });
  });
});

module.exports = router;
