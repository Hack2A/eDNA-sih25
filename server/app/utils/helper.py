
def success_response(data, message="Success"):
    return {"message": message, "data": data}

def error_response(message="Error", status=400):
    return {"error": message}, status
