<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "photo".
 *
 * @property integer $id
 * @property integer $user_id
 * @property integer $album_id
 * @property integer $position
 * @property string $filename
 * @property integer $width
 * @property integer $height
 * @property double $aspect_ratio
 * @property string $content_type
 * @property integer $hide_on_mobile
 * @property integer $hide_on_pc
 *
 * @property Album $album
 * @property User $user
 */
class Photo extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'photo';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'album_id'], 'required'],
            [['user_id', 'album_id', 'position', 'width', 'height', 'hide_on_mobile', 'hide_on_pc'], 'integer'],
            [['aspect_ratio'], 'number'],
            [['filename'], 'string', 'max' => 200],
            [['description'], 'string', 'max' => 512],
            [['content_type', 'title'], 'string', 'max' => 45]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'user_id' => 'User ID',
            'album_id' => 'Album ID',
            'position' => 'Position',
            'filename' => 'Filename',
            'width' => 'Width',
            'height' => 'Height',
            'aspect_ratio' => 'Aspect Ratio',
            'content_type' => 'Content Type',
            'hide_on_mobile' => 'Hide On Mobile',
            'hide_on_pc' => 'Hide On Pc',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAlbum()
    {
        return $this->hasOne(Album::className(), ['id' => 'album_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

   public function getUrl($subdir)
   {
      return Yii::$app->utility->getPhotoUrl($subdir, $this->filename);
   }
   
   public function getServerPath($subdir)
   {
      return Yii::$app->utility->getPhotoPath($subdir, $this->filename);
   }
   
   public function removeAssets()
   {
      Yii::$app->utility->removeImage($this->filename);
   }
}
