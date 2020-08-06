docker build --network="host" -t docker.pkg.github.com/no0dles/daita/auth-pg -f containers/auth/pg/Dockerfile packages/auth
docker push docker.pkg.github.com/no0dles/daita/auth-pg
