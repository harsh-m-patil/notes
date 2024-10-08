```bash
$ docker run hello-world
```

## Containers

A container is what we eventually want to run and host in Docker. You can think of it as an isolated machine, or a virtual machine if you prefer.

From a conceptual point of view, a container runs inside the Docker host isolated from the other containers and even the host OS. It cannot see the other containers, physical storage, or get incoming connections unless you explicitly state that it can. It contains everything it needs to run: OS, packages, runtimes, files, environment variables, standard input, and output.

![Image](typical-docker-server.png)

## Images

Any container that runs is created from an _image_. An image describes everything that is needed to create a container; it is a template for containers. You may create as many containers as needed from a single image.

![Image](docker-images.png)

## Registries

Images are stored in a _registry_. In the example above, the _app2_ image is used to create two containers. Each container lives its own life, and they both share a common root: their image from the registry.

## Common Docker Commands

- _docker ps_: lists the containers that are still running. Add the **-a** switch in order to see containers that have stopped
- _docker logs_: retrieves the logs of a container, even when it has stopped
- _docker inspect_: gets detailed information about a running or stopped container
- _docker stop_: stops a container that is still running
- _docker rm_: deletes a container

```bash
docker ps
# Lists the running containers

docker ps -a
# Lists containers that have stopped

docker log <container-id>
# Allows to have to have a look at containers output

docker inspect <container-id>
# Get a lot of info about the container

docker rm <container-id>
# Removes the container

docker container prune -f
# removes all containers -f is for confirmation
```

### More docker run

```bash
docker run alpine printenv
# apline is the image from which we want to build our container
# and printenv is the command we want to execute

docker container prune -f # remove all stoped containers
```

### Server Container

a server container

- is long-lived
- listens for incoming network connections

```bash
docker run -d alpine ping www.docker.com

# see logs since,from,until 

docker run -d -p 8085:80 nginx

# f1 of -p is port you want to open on host
# f2 is to which port it should be mapped

# volume: data stored on your machine not in the container
docker run -v /your/dir:/var/lib/mysql -d mysql:5.7
```

### Registry

Each container is created from an image. You provide the image name to the _docker run_ command. Docker first looks for the image locally and uses it when present. When the image is not present locally, it is downloaded from a _registry_.
