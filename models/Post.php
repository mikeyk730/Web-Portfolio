<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "post".
 *
 * @property integer $id
 * @property integer $user_id
 * @property string $title
 * @property string $subtitle
 * @property integer $is_published
 * @property string $date
 * @property string $url_text
 * @property integer $cover_id
 *
 * @property Album $cover
 * @property User $user
 */
class Post extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'post';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'user_id'], 'required'],
            [['id', 'user_id', 'is_published', 'cover_id'], 'integer'],
            [['date'], 'safe'],
            [['title', 'subtitle', 'url_text'], 'string', 'max' => 45]
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
            'subtitle' => 'Subtitle',
            'is_published' => 'Is Published',
            'date' => 'Date',
            'url_text' => 'Url Text',
            'cover_id' => 'Cover ID',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCover()
    {
        return $this->hasOne(Album::className(), ['id' => 'cover_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

    public function getAlbum($id)
    {
        return Album::findOne($id);
    }

    public function getCoverUrl($mobile=false, $size=1600)
    {
        return $this->cover->getRandomPhoto($mobile)->getUrl($size);
    }

    public static function getPosts($user_id)
    {
        return self::find()->where('user_id = :user_id', [':user_id' => $user_id])
                           ->orderBy('date DESC')
                           ->all();
    }
}
