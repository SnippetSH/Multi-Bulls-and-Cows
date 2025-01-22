FROM ubuntu:22.04
LABEL maintainer="gccs457@naver.com"

RUN apt-get update && apt-get install -y \
    curl \
    vim \
    git \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app

# Install Client Dependencies and Build
RUN cd client && npm install && npm run build

# Move Client Build to Server Directory
RUN cp -r client/dist server/

# Install Server Dependencies
RUN cd server && npm install && npm install nodemon ts-node -g

EXPOSE 3000

CMD ["nodemon", "server/index.ts"]