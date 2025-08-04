<?php
namespace app\models;

use yii\helpers\Url;

class User extends \yii\db\ActiveRecord implements \yii\web\IdentityInterface
{
    public static function tableName() 
    { 
        return 'user'; 
    }
    
    /**
     * @inheritdoc
     */
    public static function findIdentity($id)
    {
        $dbUser = self::find()
            ->where(["id" => $id])
            ->one();
        /*if (!count($dbUser)) {
            return null;
        }*/
        return new static($dbUser);
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        $dbUser = self::find()
            ->where(["access_token" => $token])
            ->one();
        /*if (!count($dbUser)) {
            return null;
        }*/
        return new static($dbUser);
    }

    /**
     * Finds user by username
     *
     * @param  string      $username
     * @return static|null
     */
    public static function findByUsername($username)
    {
        $dbUser = self::find()
            ->where(["username" => $username])
            ->one();
        /*if (!count($dbUser)) {
            return null;
        }*/
        return new static($dbUser);
    }

    /**
     * @inheritdoc
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @inheritdoc
     */
    public function getAuthKey()
    {
        return $this->auth_key;
    }

    /**
     * @inheritdoc
     */
    public function validateAuthKey($authKey)
    {
        return $this->auth_key === $authKey;
    }

    /**
     * Validates password
     *
     * @param  string  $password password to validate
     * @return boolean if password provided is valid for current user
     */
    public function validatePassword($password)
    {
        return $this->password === crypt($password, $this->salt);
    }

    public function getAvatarUrl()
    {
        return Url::home(true).'images/avatars/'.$this->id.'.jpg';   
    }
}
