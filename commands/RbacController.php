<?php
namespace app\commands;

use Yii;
use yii\console\Controller;

class RbacController extends Controller
{
    public function actionInit()
    {
        $auth = Yii::$app->authManager;

        // add "createAlbum" permission
        $createAlbum = $auth->createPermission('createAlbum');
        $createAlbum->description = 'Create albums';
        $auth->add($createAlbum);

        // add "author" role and give this role the "createAlbum" permission
        $author = $auth->createRole('author');
        $auth->add($author);
        $auth->addChild($author, $createAlbum);

        // add the author rule
        $rule = new \app\rbac\AuthorRule;
        $auth->add($rule);

        // add the "modifyOwnAlbum" permission and associate the rule with it.
        $modifyOwnAlbum = $auth->createPermission('modifyOwnAlbum');
        $modifyOwnAlbum->description = 'Modify own album';
        $modifyOwnAlbum->ruleName = $rule->name;
        $auth->add($modifyOwnAlbum);

        // "modifyOwnAlbum" will be used from "modifyAlbum"
        $modifyAlbum = $auth->createPermission('modifyAlbum');
        $modifyAlbum->description = 'Modify albums';
        $auth->add($modifyAlbum);
        $auth->addChild($modifyOwnAlbum, $modifyAlbum);
        
        // allow "author" to modify their own albums
        $auth->addChild($author, $modifyOwnAlbum);

        $auth->assign($author, 100);
        $auth->assign($author, 101);
    }
}
