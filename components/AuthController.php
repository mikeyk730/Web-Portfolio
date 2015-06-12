<?php
namespace app\components;

use yii\web\Controller;

class AuthController extends Controller
{

protected function isOwner($model, $id_field="user_id")
   {
      if ($model[$id_field] == \Yii::$app->user->GetId())
      {
         return true;
      }
      return false;
   }

   protected function ensureAccess($model, $id_field="user_id")
   {
      if (!$this->isOwner($model, $id_field))
      {
         throw new CHttpException(403,'You are not authorized to perform this action.');
      }
   }

	protected function authLoadModel($id, $id_field="user_id")
	{
      $model = $this->loadModel($id);
      $this->ensureAccess($model, $id_field);
      return $model;
   }

   protected function authSaveModel($model, $id_field="user_id")
   {
      $this->ensureAccess($model, $id_field);
      return $model->save();
   }

   protected function saveUploadedImage($filename, $target, $q, $w=0)
   {
      //$image = \Yii::$app->image->load(\Yii::$app->utility->getPhotoPath('original', $filename));
      //if ($w > 0){
      //   $image->resize($w, 0);
      //}
      //$image->quality($q);
      //$image->save(\Yii::$app->utility->getPhotoPath($target, $filename));
   }

   protected function processUploadedImage($filename)
   {
      $this->saveUploadedImage($filename, 'full', 92);
      $this->saveUploadedImage($filename, '1600', 92, 1600);
      $this->saveUploadedImage($filename, '800', 92, 800);
      $this->saveUploadedImage($filename, '400', 92, 400);
   }
}