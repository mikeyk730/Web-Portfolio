<?php

namespace app\controllers;

use Yii;
use app\models\Post;
use app\models\PostSearch;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;

/**
 * BlogController implements the CRUD actions for Post model.
 */
class BlogController extends Controller
{
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'delete' => ['post'],
                ],
            ],
        ];
    }

    /**
     * Lists all Post models.
     * @return mixed
     */
    public function actionList()
    {
        $searchModel = new PostSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single Post model.
     * @param integer $id
     * @return mixed
     */
    public function actionView($id=null, $url_text=null)
    {
        $is_mobile = \Yii::$app->devicedetect->isMobile() && !\Yii::$app->devicedetect->isTablet();;

        $this->layout = $is_mobile ? 'mobile' : 'posts';
        return $this->render('view', [
            'model' => $this->findModel($id, $url_text),
        ]);
    }

    public function actionIndex($user_id=100)
    {
        $posts = Post::getPosts($user_id);
        $is_mobile = \Yii::$app->devicedetect->isMobile() && !\Yii::$app->devicedetect->isTablet();;
        $this->layout = $is_mobile ? 'mobile' : 'albums';
        return $this->render('list', array('posts' => $posts, 'user_id' => $user_id));
    }

    /**
     * Creates a new Post model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model = new Post();

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        } else {
            return $this->render('create', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Updates an existing Post model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id
     * @return mixed
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        } else {
            return $this->render('update', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Deletes an existing Post model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     * @return mixed
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();

        return $this->redirect(['index']);
    }

    /**
     * Finds the Post model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return Post the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id, $url_text=null)
    {
        $model = ($url_text === null) ? 
                 Post::findOne($id) : Post::findOne(['url_text' => $url_text]);
        
        if ($model === null)
            throw new NotFoundHttpException('The requested page does not exist.');
        
        return $model;
    }
}
