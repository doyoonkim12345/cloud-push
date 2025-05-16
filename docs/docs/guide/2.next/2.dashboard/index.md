# Dashboard

## force update

유저가 사용하고 있는 해당 번들은 업데이트가 필수적임을 [`getUpdateStatus`](/guide/3.expo/5.methods.html#getupdatestatus)을 통해 확인할 수 있습니다. 

## normal update

[`deploy`](/guide/3.expo/1.commands.html#deploy)시 기본 값. 더 최신 번들이 존재하면 업데이트 하게 됩니다.

## rollback

이전 버전으로 돌아갑니다. [`rollback`](/guide/3.expo/1.commands.html#rollback)과 같은 기능을 합니다. rollback했던 번들은 다시 사용할 수 없습니다. 돌아가려는 번들을 새로 [`deploy`](/guide/3.expo/1.commands.html#deploy) 해야합니다.