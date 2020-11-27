import base64
import json
import os


CURRENT_DIR_PATH= os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT_PATH= os.path.abspath(os.path.join(CURRENT_DIR_PATH, '../..'))

def get_or_create_encryption_key():
    '''Automate the inconvenient task of generating and maintaining a consistent 
       encryption key.'''
    # Attempt to get the key from an environment variable.
    encryption_key= os.environ.get('ENKETO_ENCRYPTION_KEY')

    # If the key wasn't in the environment, attempt to get it from disk.
    secrets_dir_path= os.path.join(CURRENT_DIR_PATH, 'secrets/')
    encryption_key_file_path= os.path.join(secrets_dir_path, 'enketo_encryption_key.txt')
    if not encryption_key and os.path.isfile(encryption_key_file_path):
        with open(encryption_key_file_path, 'r') as encryption_key_file:
            encryption_key= encryption_key_file.read().strip()
    # If the key couldn't be retrieved from disk, generate and store a new one.
    elif not encryption_key:
        encryption_key= base64.b64encode(os.urandom(256))
        if not os.path.isdir(secrets_dir_path):
            os.mkdir(secrets_dir_path)
        with open(encryption_key_file_path, 'w') as encryption_key_file:
            encryption_key_file.write(encryption_key)

    return encryption_key


def create_config():

    CONFIG_FILE_PATH= os.path.join(PROJECT_ROOT_PATH, 'config/config.json')
    if not os.path.isfile(CONFIG_FILE_PATH):
        raise EnvironmentError('No Enketo Express configuration found at `{}`.'.format(CONFIG_FILE_PATH))
    else:
        try:
            with open(CONFIG_FILE_PATH, 'r') as config_file:
                config= json.loads(config_file.read())
        except:
            raise ValueError('Could not parse JSON content from `{}`.').format(CONFIG_FILE_PATH)

    # Ensure an API key was set, retrieving it from the environment as a fallback.
    config.setdefault('linked form and data server', dict()).setdefault('api key', os.environ.get('ENKETO_API_KEY'))
    if not config['linked form and data server']['api key']:
        raise EnvironmentError('An API key for Enketo Express is required.')

    # Retrieve/generate the encryption key if not present.
    config['linked form and data server'].setdefault('encryption key', get_or_create_encryption_key())
    
    # Set the Docker Redis settings.
    REDIS_MAIN = os.environ.get('ENKETO_REDIS_MAIN', 'redis-main')
    REDIS_MAIN_PORT = os.environ.get('ENKETO_REDIS_MAIN_PORT', '6379')
    REDIS_CACHE = os.environ.get('ENKETO_REDIS_CACHE', 'redis-cache')
    REDIS_CACHE_PORT = os.environ.get('ENKETO_REDIS_CACHE_PORT', '6380')

    config.setdefault('redis', dict())
    config['redis'].setdefault('main', dict())
    config['redis']['main']['host'] = REDIS_MAIN
    config['redis']['main']['port'] = REDIS_MAIN_PORT
    config['redis'].setdefault('cache', dict())
    config['redis']['cache']['host'] = REDIS_CACHE
    config['redis']['cache']['port'] = REDIS_CACHE_PORT

    # Write the potentially-updated config file to disk.
    with open(CONFIG_FILE_PATH, 'w') as config_file:
        config_file.write(json.dumps(config, indent=4))

if __name__ == '__main__':
    create_config()
