var express = require('express');
var router = express.Router();
var User = require('../models').users;
var Drawings = require('../models').drawings;
var FactorCategories = require('../models').factorCategories;
var Figures = require('../models').figures;

router.post('/', (req, res) => {
    const { name } = req.body;
    User.findOrCreate({ where: { name: name } })

        .spread((user, created) => {
            if (created) {
                console.log('========= RESULT ===========');
                console.log(
                    'POST /users/ :: DB에 없는 데이터여서 저장했습니다.'
                );
                console.log('============================');
                res.status(201).send('DB에 없는 데이터여서 저장했습니다.');
            } else {
                console.log('========= RESULT ===========');
                console.log(
                    'POST /users/ :: user information :\n',
                    user.dataValues
                );
                console.log('============================');
                res.status(200).send(
                    'DB에 이미 있는 데이터입니다. 로그인만 했습니다.'
                );
            }
        })
        .catch(err => {
            console.log('========= RESULT ===========');
            console.log('POST /users/ :: request was failed beacuse :\n', err);
            console.log('============================');
            res.status(500).send('POST /users/ request was failed');
        });
});


router.get('/load', async (req, res) => {
    try {
        const user = await User.findAll();
        const drawings = await Drawings.findAll();
        const factorCategories = await FactorCategories.findAll();
        const figures = await Figures.findAll();
        const data = [user, drawings, factorCategories, figures];
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send('User 전체 조회 실패.');
    }
});

router.delete('/deleteAll', async (req, res) => {
    const { name } = req.body;
    try {
        const findUserName = await User.findOne({ where: { name } });
        console.log(findUserName);
        if (findUserName !== null) {
            const findUserIdInDrawings = await Drawings.findOne({
                where: { userId: findUserName.dataValues.id }
            });

            await Drawings.destroy({
                where: { userId: findUserName.dataValues.id }
            });
            await Figures.destroy({
                where: { id: findUserIdInDrawings.dataValues.figureId }
            });
            res.status(200).send('유저 호재 정보 삭제 완료.');
        } else {
            res.status(404).send('유저 호재 정보 없음');
        }
        // await User.destroy({ where: { name } });
    } catch (err) {
        res.status(500).send('유저 호재 정보 삭제 실패.');
    }
});

router.post('/save', async (req, res) => {
    const { name, figureInfo, drawingInfo } = req.body;
    const { factorCategoryId } = figureInfo;
    const isValidfactorCategoryId = !!(factorCategoryId >= 1 && factorCategoryId <= 9);

    try {
        if (isValidfactorCategoryId) {
            const findUser = await User.findOne({ where: { name: name } });
            const userID = await findUser.dataValues.id;
            const createdRowInFigures = await Figures.create(figureInfo);
            const figureId = await createdRowInFigures.dataValues.id;

            Drawings.create({
                mapCenterLat: drawingInfo.mapCenterLat,
                mapCenterLng: drawingInfo.mapCenterLng,
                userID: userID,
                figureId: figureId
            });
            console.log('========= RESULT ===========');
            console.log('POST /save/ :: 저장을 완료했습니다');
            console.log('============================');
            res.status(201).send('Figures에 데이터를 추가했습니다.');
        }
    } catch (err) {
        console.log('========= RESULT ===========');
        console.log('POST /save/ :: request was failed beacuse : \n', err);
        console.log('============================');
        res.status(400).send('데이터 등록 실패! 이유는 console을 확인해야해요!');
    }

});

module.exports = router;

/*
{
	"name": "az",
	"figureInfo": {
		"shapeType": "round",
		"shapePath": "[x,y]",
		"description": "this is test description",
		"priority": 1,
		"borderWidth": 2,
		"borderColor": "red",
		"innerColor": "black",
		"factorCategoryId": 3
	}
}
*/
