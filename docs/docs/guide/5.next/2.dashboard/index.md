# Dashboard

## force update

Users can check if an update is mandatory for their current bundle through [`getUpdateStatus`](/guide/4.expo/5.methods.html#getupdatestatus).

## normal update

Default value when [`deploy`](/guide/4.expo/1.commands.html#deploy). Updates if a newer bundle exists.

## rollback

Reverts to a previous version. Functions similarly to [`rollback`](/guide/4.expo/1.commands.html#rollback). Once a bundle has been rolled back, it cannot be used again. You need to [`deploy`](/guide/4.expo/1.commands.html#deploy) the version you want to roll back to as a new bundle.
