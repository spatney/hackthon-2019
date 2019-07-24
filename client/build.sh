set -ex
USERNAME=graysense.azurecr.io
IMAGE=hack/app
docker build -t $USERNAME/$IMAGE:latest .