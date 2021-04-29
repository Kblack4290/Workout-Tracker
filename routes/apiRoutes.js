const router = require("express").Router();
const Workout = require("../models/workout");

// get all workouts

router.get("/api/workouts", (req,res) =>{
    Workout.aggregate([
        { 
            $addFields:{
                totalDuration: {
                    $sum:"$exercises.duration"
                }
            }
        }
    ])
    .sort({date:-1})
    .then(dbWorkout => {
        res.json(dbWorkout)
    })
    .catch(err => {
        res.status(400).json(err);
    });
});

// get range of workouts 
router.get("/api/workouts/range", (req,res) =>{
    Workout.find({}).limit(5)
    .sort({date:-1})
    .then(dbWorkout => {
        res.json(dbWorkout)
    })
    .catch(err => {
        res.status(400).json(err);
    });
});

// create workout
router.post("/api/workouts", ({ body }, res) => {
    Workout.create(body)
    .then(dbWorkout => {
        res.json(dbWorkout);
    })
    .catch(err => {
        res.status(400).json(err);
    });
});
// update workout
router.put("/api/workouts/:id", ({ body, params }, res) => {
    Workout.findOneAndUpdate({_id:params.id}, {$push: {exercises: body}}, {new:true})
    .then(dbWorkout => {
        res.json(dbWorkout);
    })
    .catch(err => {
        res.status(400).json(err);
    });
});

module.exports = router;