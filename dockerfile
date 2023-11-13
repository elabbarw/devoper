FROM python:3.8-slim

# copy over our requirements.txt file
COPY requirements.txt /tmp/

# upgrade pip and install required python packages
RUN pip install -U pip
RUN pip install -r /tmp/requirements.txt

# copy over our app code
WORKDIR  /app
ADD main.py .
ADD devoper devoper
ADD cfg cfg

# Set Timezone
ENV TZ=Europe/Malta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

