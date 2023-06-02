FROM public.ecr.aws/lambda/nodejs:18.2023.05.29.17-arm64
RUN npm install -g yarn

COPY web/next.config.js web/package.json web/postcss.config.js web/tailwind.config.js web/tsconfig.json ${LAMBDA_TASK_ROOT}/web/
ADD web/src ${LAMBDA_TASK_ROOT}/web/src
ADD web/public ${LAMBDA_TASK_ROOT}/web/public
COPY package.json yarn.lock ${LAMBDA_TASK_ROOT}/
ADD packages ${LAMBDA_TASK_ROOT}/packages

RUN yarn install
RUN yarn web:build

