<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "album".
 *
 * @property integer $id
 * @property integer $user_id
 * @property string $title
 * @property string $url_text
 * @property integer $is_published
 * @property string $type
 *
 * @property User $user
 * @property Photo[] $photos
 */
class Album extends \yii\db\ActiveRecord
{
   public $file;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'album';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'user_id'], 'required'],
            [['id', 'user_id', 'is_published'], 'integer'],
            [['title', 'url_text', 'type'], 'string', 'max' => 45],
            [['file'], 'file', 'maxFiles' => 50]
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
            'title' => 'Title',
            'url_text' => 'Url Text',
            'is_published' => 'Is Published',
            'type' => 'Type',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPhotos()
    {
        return $this->hasMany(Photo::className(), ['album_id' => 'id'])
                    ->orderBy('position');
    }

    public function getRandomPhoto($mobile=false)
    {
        $where = $mobile ? 'hide_on_mobile = 0' : 'hide_on_pc = 0';
        $p = $this->hasMany(Photo::className(), ['album_id' => 'id'])
                  ->where($where)->all(); 
        $i = array_rand($p);
        return $p[$i];
    }
}
