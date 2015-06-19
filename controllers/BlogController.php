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
    /**
     * Displays a single Post model.
     * @param integer $id
     * @return mixed
     */
    public function actionView($id=null, $url_text=null)
    {
        $model = $this->findModel($id, $url_text);
        if (!$model->is_published){
            if (!\Yii::$app->user->can('modifyAlbum', ['content' => $model])) {
                throw new NotFoundHttpException("The requested page does not exist."); 
            }
        }

        $is_mobile = \Yii::$app->devicedetect->isMobile() && !\Yii::$app->devicedetect->isTablet();;

        $this->layout = $is_mobile ? 'mobile' : 'posts';
        return $this->render('view', [
            'model' => $model,
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
