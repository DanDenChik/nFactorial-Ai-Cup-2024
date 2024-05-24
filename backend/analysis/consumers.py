import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class InstagramStatusConsumer(WebsocketConsumer):
    def connect(self):
        self.username = self.scope["url_route"]["kwargs"]["username"]
        self.accept()
        async_to_sync(self.channel_layer.group_add)(self.username, self.channel_name)

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.username, self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        self.send(text_data=json.dumps({"message": message}))

    def send_status(self, event):
        message = event["message"]
        self.send(text_data=json.dumps({"message": message}))
