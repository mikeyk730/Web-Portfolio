<?php

namespace app\controllers;

use Yii;
use app\models\Photo;
use app\models\PhotoSearch;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\web\UploadedFile;
use app\components\AuthController;

/**
 * PhotoController implements the CRUD actions for Photo model.
 */
class PhotoController extends AuthController
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
     * Lists all Photo models.
     * @return mixed
     */
    public function actionIndex()
    {
        $searchModel = new PhotoSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single Photo model.
     * @param integer $id
     * @return mixed
     */
    public function actionView($id)
    {
        return $this->render('view', [
            'model' => $this->findModel($id),
        ]);
    }

    /**
     * Creates a new Photo model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
   /*public function actionCreate()
    {
        $model = new Photo();

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        } else {
            return $this->render('create', [
                'model' => $model,
            ]);
        }
        }*/

   public function actionCreate()
   {
		$model = new Photo();
      $model->user_id = Yii::$app->user->getId();

		if(isset($_POST['Photo']))
		{
			$model->attributes = $_POST['Photo'];
         $file = UploadedFile::getInstance($model, 'image');

         if($file){            
            $model->filename =  Yii::$app->utility->generateFilename("jpg");
            $size = getimagesize($file->tempName);
            $model->width = $size[0];
            $model->height = $size[1];
            $model->aspect_ratio = $size[0]/$size[1];
            $model->content_type = $file->type;
         }

			if($this->authSaveModel($model)){
            if($file){
               $file->saveAs($model->getServerPath('original'));
               $this->processUploadedImage($model->filename);
            }

            if (Yii::$app->request->isAjax){
               return $this->renderJSON(array("success"=>1, "data"=>$model->dataForJson()));
            }
            else {
               return $this->redirect(array('view','id'=>$model->id));
            }
         }
         else if (Yii::$app->request->isAjax){
            return $this->renderJSON(array("success"=>0));
         }
         //TODO: not authorized error
		}

      return $this->render('upload', [
         'model' => $model,
      ]);
   }

    /**
     * Updates an existing Photo model.
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
     * Deletes an existing Photo model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     * @return mixed
     */
    public function actionDelete($id)
    {
		$model = $this->authLoadModel($id);
      $model->removeAssets();
      $model->delete();

      if (Yii::$app->request->isAjax){
         $this->renderJSON(array("success"=>1));
      }

		// if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
		if(!isset($_GET['ajax']))
			$this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('index'));
    }

    /**
     * Finds the Photo model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return Photo the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = Photo::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }
}
